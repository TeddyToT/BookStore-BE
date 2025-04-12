const _ = require('lodash');

const getData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

module.exports = getData;