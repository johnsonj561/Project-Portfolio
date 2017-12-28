const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
// Models
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Course = require('../models/course.model');
const Project = require('../models/project.model');

// token
const TOKEN_EXPIRATION = '30m'


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
    res.json({
      success: false,
      message: "Username and password are required"
    });
  } else if (user.password !== user.passwordConfirmation) {
    res.json({
      success: false,
      message: "Confirmation password must match password"
    });
  } else {
    user.save(function (err) {
      // Error
      if (err) {
        if (err.errors) {
          if (err.errors.username) {
            res.json({
              success: false,
              message: err.errors.username.message
            });
          } else if (err.errors.password) {
            res.json({
              success: false,
              message: err.errors.password.message
            });
          } else {
            res.json({
              success: false,
              message: err
            });
          }
        } else if (err) {
          if (err.code == 11000) {
            res.json({
              success: false,
              message: "Username already exists"
            });
          } else {
            res.json({
              success: false,
              message: err
            });
          }
        }
      }
      // Success
      else {
        res.json({
          success: true,
          message: "Registration successful"
        });
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
    return res.json({
      success: false,
      message: 'Must provide username and password'
    });
  }
  User.findOne({
    username: username
  }).select('username password').exec(function (err, user) {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    } else if (!user) {
      res.json({
        success: false,
        message: 'Invalid username'
      });
    } else if (user) {
      if (password) {
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({
            success: false,
            message: 'Invalid password'
          });
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
        res.json({
          success: false,
          message: 'No password provided'
        });
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
    }).catch(err => {
      res.json({
        success: false,
        message: 'Error getting categories',
        error: err
      });
    });
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
      res.json({
        success: false,
        message: `Project ${projectName} not found`
      });
    }
  }).catch(err => {
    res.json({
      success: false,
      message: 'Error getting projects',
      error: err
    });
  });
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
  }).catch(err => {
    res.json({
      success: false,
      message: 'Error getting projects',
      error: err
    });
  });
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
  }).catch(err => {
    res.json({
      success: false,
      message: 'Error getting courses',
      error: err
    });
  })
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
  }).catch(err => {
    res.json({
      success: false,
      message: 'Error getting course ${courseTitle}',
      error: err
    });
  });
});



/*
 * Token Validation Middleware
 * Valid token is required to access the proceeding routes
 */
router.use((req, res, next) => {
  const token = req.body.token || req.body.query || req.headers['x-access-token'];
  console.log('middleware token', token);
  if (token) {
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      if (err) {
        res.json({
          success: false,
          message: 'Invalid token, unable to verify'
        });
      } else {
        console.log('Token validated');
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.json({
      success: false,
      message: 'Unable to proceed, no token provided'
    });
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
    res.json({
      success: false,
      message: 'Project name is required'
    });
  } else {
    project.save(function (err) {
      if (err) {
        if (err.errors && err.errors.name) {
          res.json({
            success: false,
            message: err.errors.name
          });
        } else {
          res.json({
            success: false,
            message: 'Error saving project to DB',
            error: err
          });
        }
      } else {
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
      res.json({
        success: false,
        message: `Unable to lookup Project ${projectName} in DB`
      });
    } else {
      project.date = req.body.date;
      project.tags = req.body.tags;
      project.implementation = req.body.implementation;
      project.description = req.body.description;
      project.github = req.body.github;
      project.course = req.body.course;
      project.save()
        .then(resp => {
          res.json({
            success: true,
            message: `Project ${projectName} updated successfully`,
            data: req.body
          });
        }).catch(err => {
          res.json({
            success: false,
            message: `Error updating Project ${projectName}`,
            error: err
          });
        });
    }
  }).catch(err => {
    res.json({
      success: false,
      message: `Error getting Project ${projectName} from DB`,
      error: err
    });
  })
});

/**
 * DELETE Project
 * Delete project with projectName from Project collection
 */
router.delete('/project/:projectName', (req, res) => {
  const projectName = req.params.projectName;
  Project.findOneAndRemove({
    name: projectName
  }).then(resp => {
    res.json({
      success: true,
      message: `Project ${projectName} was deleted from DB`
    });
  }).catch(err => {
    res.json({
      success: false,
      message: `Error deleting ${projectName} from DB`,
      error: err
    })
  });
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
    res.json({
      success: false,
      message: 'Course title and description are required'
    });
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
        res.json({
          success: false,
          message: `Course ${course.title} already exists`
        });
      } else {
        res.json({
          success: false,
          message: `Error saving ${course.title} to DB`,
          error: err
        });
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
      res.json({
        success: false,
        message: `Unable to lookup course ${courseTitle} in DB`
      });
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
      }).catch(err => {
        res.json({
          success: false,
          message: `Error updating Course ${courseTitle}`,
          error: err
        });
      });
    }
  }).catch(err => {
    res.json({
      success: false,
      message: `Error getting Course ${courseTitle} from DB`,
      error: err
    });
  });
});


/**
 * DELETE Course
 * Remove course with courseTitle from Course Collection
 */
router.delete('/course/:courseTitle', (req, res) => {
  const courseTitle = req.params.courseTitle;
  Course.findOneAndRemove({
    title: courseTitle
  }).then(resp => {
    res.json({
      success: true,
      message: `Course ${courseTitle} was deleted from DB`
    });
  }).catch(err => {
    res.json({
      success: false,
      message: `Error deleting ${courseTitle} from DB`,
      error: err
    })
  });
});


/**
 * POST Category
 * Inserts unique category to categories collection
 */
router.post('/category', (req, res) => {
  const category = new Category();
  category.name = req.body.name;
  if (!category.name) {
    res.json({
      success: false,
      message: 'Category name is required'
    });
  } else {
    category.save(function (err) {
      if (err) {
        res.json({
          success: false,
          message: 'An error occurred while saving category',
          error: err,
          category: category
        });
      } else {
        res.json({
          success: true,
          message: 'Category saved',
          category: category
        });
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
    })
    .then(resp => {
      res.json({
        success: true,
        message: `Category ${name} deleted`
      })
    }).catch(err => {
      res.json({
        success: false,
        message: `Error deleting category ${name}`,
        error: err
      });
    })
});



module.exports = router;
