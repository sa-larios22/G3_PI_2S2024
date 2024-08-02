const readXlsxFile = require('read-excel-file/node');
const SimpleTextQuestion = require('../models/text');
const MultipleQuestion = require('../models/multiple');
const CheckQuestion = require('../models/check');
const MathQuestion = require('../models/math');



const readExcel = async(path) => {
    
    const questions = readXlsxFile(path).then((rows) => {
    
        let questionArray = [];

        for (let i = 0; i < rows.length; i++) {
            const element = rows[i];
            if (element[0] === 'texto') {
                let question;
                let questionRow = rows[i+1]
                if (element[1] === 'requerida') {
                    question = new SimpleTextQuestion(questionRow[1], true);
                } else {
                    question = new SimpleTextQuestion(questionRow[1], false);
                }

                questionArray.push(question);
            }  else if (element[0] === 'math') {
                let mathQuestion;
                let questionRow = rows[i+1]
                let answernRow = rows[i+2]
                if (element[1] === 'requerida') {
                    mathQuestion = new MathQuestion(questionRow[1], answernRow[1], true);
                } else {
                    mathQuestion = new MathQuestion(questionRow[1], answernRow[1], false);
                }
                questionArray.push(mathQuestion);
            } else if (element[0] === 'multiple') {
                let multipleQuestion;
                let dataRows = rows[i+1];
                let firstAnswer = rows[i+2];
                let secondAnswer = rows[i+3];

                if (element[1] === 'requerida') {
                    multipleQuestion = new MultipleQuestion(dataRows[1], firstAnswer[1], secondAnswer[1], true);
                } else {
                    multipleQuestion = new MultipleQuestion(dataRows[1], firstAnswer[1], secondAnswer[1], false);
                }

                questionArray.push(multipleQuestion);
                
            } else if (element[0] === 'checkbox') { 
                let checkboxQuestion;
                let dataRows = rows[i+1];
                let firstAnswer = rows[i+2];
                let secondAnswer = rows[i+3];
                let thirdAnswer = rows[i+4];

                if (element[1] === 'requerida') {
                    checkboxQuestion = new CheckQuestion(dataRows[1], firstAnswer[1], secondAnswer[1], thirdAnswer[1], true);
                } else {
                    checkboxQuestion = new CheckQuestion(dataRows[1], firstAnswer[1], secondAnswer[1], thirdAnswer[1], false);
                }

                questionArray.push(checkboxQuestion);
            } else {
                continue;
            }
        }

        return questionArray;
    
    });

    return questions;
}

module.exports = {
    readExcel
};