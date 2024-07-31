const path = require('path');
const readXlsxFile = require('read-excel-file/node');

const EXCEL_PATH = path.join(process.cwd(), 'ejemplo-forms.xlsx');

const readExcel = async() => {
    // File path.
    readXlsxFile(EXCEL_PATH).then((rows) => {
        
    })
}

module.exports = {
    readExcel
};