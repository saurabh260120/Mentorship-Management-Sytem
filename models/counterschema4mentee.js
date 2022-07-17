const mongoose = require("mongoose");

const countermenteeSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        required: true
    }
});

const CounterMentee = mongoose.model('CounterMentee', countermenteeSchema);

const getSequenceNextValue = (seqName) => {
    return new Promise((resolve, reject) => {
        CounterMentee.findByIdAndUpdate(
            { "_id": seqName },
            { "$inc": { "seq": 1 } }
            , (error, CounterMentee) => {
                if (error) {
                    reject(error);
                }
                if(CounterMentee) {
                    resolve(CounterMentee.seq + 1);
                } else {
                    resolve(null);
                }
            });
    });
};

const insertCounter = (seqName) => {
    const newCounter = new CounterMentee({ _id: seqName, seq: 1 });
    return new Promise((resolve, reject) => {
    newCounter.save()
        .then(data => {
            resolve(data.seq);
        })
        .catch(err => reject(error));
    });
}
module.exports = {
    CounterMentee,
    getSequenceNextValue,
    insertCounter
}