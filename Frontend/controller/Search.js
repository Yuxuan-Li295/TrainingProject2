const Get = (Schema, filter, req, res, populate1, populate2) => {
  let form = req.query;
  let user = req.user;
  // const reg = new RegExp(search, "i");

  let PageIndex = parseInt(form.PageIndex);
  let PageSize = parseInt(form.PageSize);

  //当前页码
  if (PageIndex == -1) PageIndex = 1;
  Schema.find({ ...filter, user })
    .skip((PageIndex - 1) * PageSize)
    .limit(PageSize)
    .sort({ updatedAt: -1 })
    .populate(populate1)
    .populate(populate2)
    .lean()
    .then(List => {
      Schema.countDocuments({ ...filter, user }, (err, count) => {
        if (err) res.status(500).send(err);
        res.send({ PageIndex, PageSize, PageCount: Math.ceil(count / PageSize), List });
      });
    })
    .catch(err => {
      throw err;
    });
};

module.exports = { Get };
