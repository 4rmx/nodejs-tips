async function finder(start_at, end_at, order, limit) {
    try {
        const client = await require('./mongodb')(2);
        const { db_info } = require('./mongodb');

        let filter = {}

        if (start_at) {
            const startDate = { $gte: new Date(start_at) }
            filter = { ...filter, create_at: { ...filter.create_at, ...startDate } }
        };
        if (end_at) {
            const endDate = { $lte: new Date(end_at) }
            filter = { ...filter, create_at: { ...filter.create_at, ...endDate } }
        };

        let condition = [{ $match: filter }]
        if (order) condition.push({ $sort: { create_at: order === 'asc' ? 1 : -1 } })
        else { condition.push({ $sort: { create_at: -1 } }) }
        if (limit) condition.push({ $limit: Number(limit) });

        const result = await db_info.aggregate(condition).toArray();
        console.log(result);

        await client.close();
    } catch (err) {
        console.log(err);
    }
};

finder();
