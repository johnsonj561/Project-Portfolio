const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
// Models
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Course = require('../models/course.model');
const Project = require('../models/project.model');
// Search Modules
const natural = require('natural');
const Collection = require('../search/collection');
const CosineSimilarity = require('../search/cosine-similarity');
const getCosineSimilarity = CosineSimilarity.cosineSimilarity;
const searchUtils = require('../search/search');

// token
const TOKEN_EXPIRATION = '30m'

// load Collection
const COLLECTION_PATH = './server/search/collection-tfidf.json';
let collection = new Collection(COLLECTION_PATH);
collection.loadFromFile()
  .then(resp => console.log('Project TFIDF values loaded from ' + COLLECTION_PATH))
  .catch(err => console.log('Error loading collection from ' + COLLECTION_PATH + ': ', err));


/*
 * Register New User
 * Validates new user information and stores in mongodb
 */
router.post('/user', (req, res) => {
  var user = new User();
  user.username = req.body.username.toLowerCase();
  user.password = req.body.password;
  user.passwordConfirmation = req.body.passwordConfirmation;
  if (!(user.username && user.password)) {
    res.json(getRespObject(false, "Username and password are required" ));
  } else if (user.password !== user.passwordConfirmation) {
    res.json(getRespObject(false, "Confirmation password must match password"));
  } else {
    user.save(function (err) {
      // Error
      if (err) {
        if (err.errors) {
          if (err.errors.username) {
            res.json(getRespObject(false, err.errors.username.message));
          } else if (err.errors.password) {
            res.json(getRespObject(false, err.errors.password.message));
          } else {
            res.json(getRespObject(false, err));
          }
        } else if (err) {
          if (err.code == 11000) {
            res.json(getRespObject(false, 'Username already exists'));
          } else {
            res.json(getRespObject(false, err));
          }
        }
      }
      // Success
      else {
        res.json(getRespObject(true, 'Registration successful'));
      }
    });
  }
});


/*
 * Login User
 * Validates username/password and creates session
 */
router.post('/authenticate', (req, res) => {
  const username = req.body.username.toLowerCase();
  const password = req.body.password;
  if (!(username && password)) {
    return res.json(getRespObject(false, 'Must provide username and password'));
  }
  User.findOne({
    username: username
  }).select('username password').exec(function (err, user) {
    if (err) {
      res.json(getRespObject(false, err));
    } else if (!user) {
      res.json(getRespObject(false, 'Invalid username'));
    } else if (user) {
      if (password) {
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json(getRespObject(false, 'Invalid password'));
        } else {
          // else username/password valid, gen token
          var token = jwt.sign({
              username: user.username
            },
            process.env.SECRET, {
              expiresIn: TOKEN_EXPIRATION
            });
          res.json({
            success: true,
            message: 'User authenticated',
            token: token
          });
        }
        // else no password was provided
      } else {
        res.json(getRespObject(false, 'No password provided'));
      }
    }
  });
});

/**
 * GET Category
 * Returns all categories from Category Collection
 */
router.get('/category', (req, res) => {
  Category.find()
    .then(resp => {
      res.json({
        success: true,
        data: resp
      })
    }).catch(err => res.json(getRespObject(false, 'Error getting categories', err)));
});

/**
 * GET Project
 * Get project with projectName from Project collection
 */
router.get('/project/:projectName', (req, res) => {
  const projectName = req.params.projectName;
  Project.findOne({
    name: projectName
  }).then(resp => {
    if (resp) {
      res.json({
        success: true,
        data: resp
      });
    } else {
      res.json(getRespObject(false, `Project ${projectName} not found`));
    }
  }).catch(err => res.json(getRespObject(false, 'Error getting projects')));
});

/**
 * GET Projects
 * Get all projects from Project collection
 */
router.get('/projects', (req, res) => {
  Project.find().then(resp => {
    res.json({
      success: true,
      data: resp
    })
  }).catch(err => res.json(getRespObject(false, 'Error getting projects')));
});


/**
 * GET Courses
 * Get all courses from Course collection
 */
router.get('/courses', (req, res) => {
  Course.find().then(resp => {
    res.json({
      success: true,
      data: resp
    });
  }).catch(err => res.json(getRespObject(false, 'Error getting courses', err)));
});


/**
 * Get Course
 * Get course with courseTitle from Course collection
 */
router.get('/course/:courseTitle', (req, res) => {
  const courseTitle = req.params.courseTitle;
  Course.findOne({
    title: courseTitle
  }).then(resp => {
    if (resp) {
      res.json({
        success: true,
        data: resp
      });
    } else {
      res.json({
        success: false,
        message: `Course ${courseTitle} not found`
      });
    }
  }).catch(err => res.json(getRespObject(false, `Error getting course ${courseTitle}`, err)));
});

/**
 * Search projects for query phrase
 * Calculate tf-idf for all query-doc pairs and return top 5 results
 */
router.get('/search/:query', function (req, res, next) {
  let query = req.params.query;
  if(!query || !query.length) {
    return res.json(getRespObject(false, 'Query phrase is required'));
  }
  // if no collection loaded return error
  if (!collection) {
    return res.json(getRespObject(false, 'No collection available for search operation'));
  }

  // get query tfidf
  queryTfidf = searchUtils.calcTfIdf(query);

  // for each document, calculate cosine similarity
  let results = [];
  collection.documentList.forEach((doc, idx) => {
    const cs = getCosineSimilarity(queryTfidf, collection.tfidf.listTerms(idx));
    if(cs > 0) {
      results.push({
        name: doc.projectName,
        score: cs
      });
    }
  });

  // sort array by tfidf descending
  results.sort(function (a, b) {
    return (a.score < b.score) ? 1 : -1;
  })

  const data = {
    data: results.slice(0, 5),
    query: query
  }

  res.json({
    success: true,
    data: data
  });
})


/*
 * Token Validation Middleware
 * Valid token is required to access the proceeding routes
 */
router.use((req, res, next) => {
  const token = req.body.token || req.body.query || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      if (err) {
        res.json(getRespObject(false, 'Invalid token, unable to verify'));
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.json(getRespObject(false, 'Unable to proceed, no token provided'));
  }
});


/**
 * GET Session Details
 * Returns username and token
 */
router.get('/session', (req, res) => {
  res.json({
    success: true,
    message: 'Decoded',
    data: req.decoded
  });
});


/**
 * POST Project
 * Add new project to Project collection
 */
router.post('/project', (req, res) => {
  const project = new Project();
  // TODO
  // replace obj assignment with _.extend/_.merge
  project.name = req.body.name;
  project.date = req.body.date;
  project.tags = req.body.tags;
  project.implementation = req.body.implementation;
  project.description = req.body.description;
  project.github = req.body.github;
  project.course = req.body.course;
  if (!(project.name && project.date)) {
    res.json(getRespObject(false, 'Project name is required'));
  } else if(project.name.length > 34) {
    res.json(getRespObject(false, 'Project must be less than 34 characters'));
  } else {
    project.save(function (err) {
      if (err) {
        if (err.errors && err.errors.name) {
          res.json(getRespObject(false, err.errors.name));
        } else {
          res.json(getRespObject(false, 'Error saving project to DB', err));
        }
      } else {
        setTimeout(_ => updateTfidfValues(collection), 0);
        res.json({
          success: true,
          message: 'Project saved',
          data: {
            name: project.name,
            date: project.date,
            tags: project.tags,
            github: project.github,
            implementation: project.implementation,
            description: project.description,
            course: project.course,
          }
        });
      }
    });
  }
});

/**
 * PUT Project
 * Update an existing project in Project collection
 */
router.put('/project', (req, res) => {
  const projectName = req.body.name;
  Project.findOne({
    name: projectName
  }).then(project => {
    if (!project) {
      res.json(getRespObject(false, `Unable to lookup Project ${projectName} in DB`));
    } else {
      project.date = req.body.date;
      project.tags = req.body.tags;
      project.implementation = req.body.implementation;
      project.description = req.body.description;
      project.github = req.body.github;
      project.course = req.body.course;
      project.save()
        .then(resp => {
          setTimeout(_ => updateTfidfValues(collection), 0);
          res.json({
            success: true,
            message: `Project ${projectName} updated successfully`,
            data: req.body
          });
        })
        .catch(err => res.json(getRespObject(false, `Error updating Project ${projectName}`, err)));
    }
  })
  .catch(err => res.json(getRespObject(false, `Error getting Project ${projectName} from DB`, err)));
});

/**
 * DELETE Project
 * Delete project with projectName from Project collection
 */
router.delete('/project/:projectName', (req, res) => {
  const projectName = req.params.projectName;
  Project.findOneAndRemove({
    name: projectName
  })
  .then(resp => {
    setTimeout(_ => updateTfidfValues(collection), 0);
    res.json(getRespObject(true, `Project ${projectName} was deleted from DB`))
  })
  .catch(err => res.json(getRespObject(false, `Error deleting ${projectName} from DB`, err)));
});

/**
 * POST Course
 * Add new course to Course collection
 */
router.post('/course', (req, res) => {
  console.log('\n\nPOST COURSE\n:', req.body);
  const course = new Course();
  // TODO
  // replace obj assignment with _.extend/_.merge
  course.title = req.body.title;
  course.semester = req.body.semester;
  course.year = req.body.year;
  course.book = req.body.book;
  course.description = req.body.description;
  course.topics = req.body.topics;
  if (!(course.title && course.description)) {
    res.json(getRespObject(false, 'Course title and description are required'));
  } else {
    course.save().then(resp => {
      console.log('resp', resp);
      res.json({
        success: true,
        message: `Course ${course.title} saved to DB`,
        data: req.body
      });
    }).catch(err => {
      if (err.code === 11000) {
        res.json(getRespObject(false, `Course ${course.title} already exists`));
      } else {
        res.json(getRespObject(false, `Error saving ${course.title} to DB`, err));
      }
    });
  }
});


/**
 * PUT Course
 * Updates an existing course
 */
router.put('/course', (req, res) => {
  const courseTitle = req.body.title;
  Course.findOne({
    title: courseTitle
  }).then(course => {
    if (!course) {
      res.json(getRespObject(false,  `Unable to lookup course ${courseTitle} in DB`));
    } else {
      course.semester = req.body.semester;
      course.year = req.body.year;
      course.book = req.body.book;
      course.description = req.body.description;
      course.topics = req.body.topics;
      course.save().then(resp => {
        res.json({
          success: true,
          message: `Course ${courseTitle} updated successfully`,
          data: req.body
        });
      }).catch(err => res.json(getRespObject(false, `Error updating Course ${courseTitle}`, err)));
    }
  }).catch(err => res.json(getRespObject(false, `Error getting Course ${courseTitle} from DB`, err)));
});


/**
 * DELETE Course
 * Remove course with courseTitle from Course Collection
 */
router.delete('/course/:courseTitle', (req, res) => {
  const courseTitle = req.params.courseTitle;
  Course.findOneAndRemove({
    title: courseTitle
  })
  .then(resp => res.json(getRespObject(true, `Course ${courseTitle} was deleted from DB`)))
  .catch(err => res.json(getRespObject(false, `Error deleting ${courseTitle} from DB`, err)));
});


/**
 * POST Category
 * Inserts unique category to categories collection
 */
router.post('/category', (req, res) => {
  const category = new Category();
  category.name = req.body.name;
  if (!category.name) {
    res.json(getRespObject(false, 'Category name is required'));
  } else {
    category.save(function (err) {
      if (err) {
        res.json(getRespObject(false, 'An error occurred while saving category', err));
      } else {
        res.json(getRespObject(true, 'Category saved'));
      }
    })
  }
});


/**
 * Delete A Category
 * Removes single instance of category from categories collection
 */
router.delete('/category/:categoryName', (req, res) => {
  console.log(req.params);
  const name = req.params.categoryName;
  Category.findOneAndRemove({
      name
    }).then(resp => res.json(getRespObject(true, `Category ${name} deleted`)))
    .catch(err => res.json(getRespObject(false, `Error deleting category ${name}`, err)));
});



/**
 * POST Collection Init
 * Builds project collection and writes tfidf values to COLLECTION_PATH
 */
router.post('/collection-init', (req, res) => {
  // create a new collection with all projects
  collection = new Collection(COLLECTION_PATH);
  updateTfidfValues(collection)
    .then(resp => res.json(getRespObject(true, `All project TFIDF values written to ${COLLECTION_PATH}`)))
    .catch(err => res.json(getRespObject(false, err)));
});




function getRespObject(success, message, errors) {
  return {
    success,
    message,
    errors
  }
}

function updateTfidfValues(collection) {
  return new Promise((resolve, reject) => {
    Project.find()
      .then(resp => {
        if(!resp || !resp.length) reject('No Projects found, unable to initialize collection');
        collection = new Collection(COLLECTION_PATH);
        resp.forEach(project => {
          let text = `${project.description} ${project.github} ${project.date} ${project.course}`;
          project.implementation.forEach(detail => text += ' ' + detail);
          project.tags.split(',')
            .map(tag => tag.trim() + ' ')
            .forEach(tag => text += tag.repeat(3));
          text += `${project.name} `.repeat(5);
          collection.addDocument(project.name, text);
        });
        collection.saveToFile();
        resolve();
      }).catch(err => reject("Unable to initialize collection", err));
  });
}

module.exports = router;
