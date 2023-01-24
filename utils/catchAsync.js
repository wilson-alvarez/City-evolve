module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}

// This is the long version of the error handler used above
//module.exports = (func) => {
  //  return function (req, res, next) {
    //    try {
      //      func(req, res, next);
        //} catch (err) {
          //  next(err);
        //}
    //}
//}

