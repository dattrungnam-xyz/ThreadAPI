class apiFeatures {
  constructor(query, queryParams) {
    this.query = query;
    this.queryParams = queryParams;
  }
  filter() {
    let queryObj = { ...this.queryParams };
    let exclude = ["sort", "page", "limit", "fields"];
    exclude.forEach((field) => {
      if (queryObj[field]) {
        delete queryObj[field];
      }
    });

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  limitFields() {
    if (this.queryParams.fields) {
      let fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
    F;
  }
  sort() {
    if (this.queryParams.sort) {
      this.query = this.query.sort(this.queryParams.sort.split(",").join(" "));
    } else {
      this.query = this.query.sort("-createAt");
    }
    return this;
  }
  pagination() {
    let page = +this.queryParams.page || 1;
    let limit = +this.queryParams.limit || 100;
    let skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
  population(options) {
    this.query = this.query.populate(options);
    return this;
  }
}

export { apiFeatures };
