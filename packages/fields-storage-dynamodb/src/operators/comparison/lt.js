const lt = {
    canProcess: ({ value }) => {
        return value && typeof value["$lt"] !== "undefined";
    },
    process: ({ key, value }) => {
        return {
            expression: `#${key} < :${key}`,
            attributeNames: {
                [`#${key}`]: key
            },
            attributeValues: {
                [`:${key}`]: value["$gt"]
            }
        };
    }
};
module.exports = lt;