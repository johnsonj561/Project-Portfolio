const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
// Models
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Course = require('../models/course.model');
const Project = require('../models/project.model');

// token
const TOKEN_EXPIRATION = '20m'


/* GET api listing. */
router.get('/navbarData', (req, res) => {
  console.log('navbarData API hit\n\n');
  res.json({
    success: true,
    message: 'Api is working!'
  });
});


/*
 * Register New User
 * Validates new user information and stores in mongodb
 */
router.post('/user', function (req, res) {
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
router.post('/authenticate', function (req, res) {
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

router.get('/category', function (req, res) {
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
 * GET Project
 * Get all projects from Project collection
 */
router.get('/project', function (req, res) {
  Project.find()
    .then(resp => {
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
 * POST Project
 * Add new project to Project collection
 */
router.post('/project', function (req, res) {
  const project = new Project();
  console.log('\nreq.body: ', req.body);
  project.name = req.body.name;
  project.date = req.body.date;
  project.tags = req.body.tags;
  project.implementation = req.body.implementation;
  project.description = req.body.description;
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
            implementation: project.implementation,
            description: project.description
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
router.put('/project', function (req, res) {
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
router.delete('/project/:projectName', function (req, res) {
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
 * Course API
 */
router.get('/course', function (req, res) {
  res.json({
    success: true,
    message: 'get(api/course)'
  });
});
router.post('/course', function (req, res) {
  res.json({
    success: true,
    message: 'post(api/course)'
  });
});
router.put('/course', function (req, res) {
  res.json({
    success: true,
    message: 'put(api/course)'
  });
});
router.delete('/course', function (req, res) {
  res.json({
    success: true,
    message: 'delete(api/course)'
  });
});


/**
 * Put New Category
 * Inserts unique category to categories collection
 */
router.post('/category', function (req, res) {
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
router.delete('/category/:categoryName', function (req, res) {
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
