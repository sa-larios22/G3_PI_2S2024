const path = require('path');
const {google} = require('googleapis');
const QRCode = require('qrcode')
const pdfMake = require('pdfmake/build/pdfmake');
const { Roboto } = require('./fonts/Roboto');
pdfMake.fonts = {
    Roboto: {
        normal: Roboto.normal,
        bold: Roboto.bold,
        italic: Roboto.italics,
        bolditalic: Roboto.bolditalics
    }
}

const { readExcel } = require('./helpers/read-file');
const { authorize } = require('./helpers/google-auth');
const { inquirerMenu, pause } = require('./helpers/inquirer-opt');
const { createForm, setQuiz, addItemToQuiz, setTitle, addItemToForm, getDataFromForm } = require('./helpers/google-form');

const EXCEL_FORM_PATH = path.join(process.cwd(), 'ejemplo-forms.xlsx');
const EXCEL_QUIZA_PATH = path.join(process.cwd(), 'ejemplo-quiz.xlsx');

const main = async() => {

    const auth = await authorize();
    const forms = google.forms({
        version: 'v1',
        auth,
    });

    let opt = '';
    let formQuestion;
    let formIdF;
    let formUrlF;
    let questionFormIdResponse;
    let responseFormArray;
    
    let quizQuestion;
    let quizId;
    let quizUrl;
    let questionQuizIdResponse;
    let responseQuizArray;

    do {
        opt = await inquirerMenu();
        switch (opt) {
            case '1':
                quizQuestion = await readExcel(EXCEL_QUIZA_PATH);
                console.log('Excel de quiz leido correctamente');
            break;
                
            case '2':
                formQuestion = await readExcel(EXCEL_FORM_PATH);
                console.log('Excel de formulario leido correctamente');
            break;

            case '3':
                console.log('Quiz');
                const { formId: qId, formUrl: qUrl } = await createForm(forms, 'Quiz');
                quizId = qId;
                quizUrl = qUrl;
                await setQuiz(forms, quizId);
                await setTitle(forms, quizId, 'Quiz');
            break

            case '4':
                console.log('Formulario');
                const { formId, formUrl } = await createForm(forms, 'Formulario');
                formIdF = formId;
                formUrlF = formUrl;
                await setTitle(forms, formId, 'Formulario');
            break

            case '5':
                questionQuizIdResponse = await addItemToQuiz(forms, quizId, quizQuestion);
                console.log('Generando QR');
                await QRCode.toString(quizUrl,{type:'terminal'}, function (err, url) {
                    console.log(url)
                })
                pause()
            break

            case '6':
                questionFormIdResponse = await addItemToForm(forms, formIdF, formQuestion);
                console.log('Generando QR');
                await QRCode.toString(formUrlF,{type:'terminal'}, function (err, url) {
                    console.log(url)
                })
                pause()
            break

            case '7':
                responseQuizArray = await getDataFromForm(forms, '1qJVpG2jUKex0lkfq4W43AqEjMHROAWZp50919euTm9I');
                responseQuizArray.map((response) => {
                    for (const [key, value] of Object.entries(response.answers)) {
                        console.log(`Question ID: ${value.questionId}`);
                        console.log('Answers:');
                        console.log(value.textAnswers.answers);
                    }
                })
                
            break
            
            case '8':
                responseFormArray = await getDataFromForm(forms, '1FW3Enz7_CBvRWdAVt8TTxqwEtdYkjB9yDZjHE8S7sG4');
                var formPdf = {
                    content: [
                        {text: 'Reporte de respuesta del formulario', style: 'header'},
                        'Las respuestas de este formulario fueron recopiladas de los estudiantes del curso de Practicas Intermedias',
                        {text: 'Respuestas', style: 'subheader'},
                        {
                            style: 'tableExample',
                            table: {
                                body: [
                                    ['Pregunta 1', 'Pregunta 2', 'Pregunta 3'],
                                    responseFormArray.map((response) => {
                                        let answers = [];
                                        for (const [key, value] of Object.entries(response.answers)) {
                                            if (value.textAnswers.answers.length > 1) {
                                                answers.push({
                                                    stack: [
                                                        {
                                                            ul: value.textAnswers.answers.map((answer) => {
                                                                return answer.value;
                                                            })
                                                        }
                                                    ]
                                                })
                                            } else {
                                                answers.push(value.textAnswers.answers[0].value);
                                            }
                                            
                                        }
                                    })
                                    
                                ]
                            }
                        },
                    ],
                    styles: {
                        header: {
                            fontSize: 18,
                            bold: true,
                            margin: [0, 0, 0, 10]
                        },
                        subheader: {
                            fontSize: 16,
                            bold: true,
                            margin: [0, 10, 0, 5]
                        },
                        tableExample: {
                            margin: [0, 5, 0, 15]
                        },
                        tableHeader: {
                            bold: true,
                            fontSize: 13,
                            color: 'black'
                        }
                    },
                    defaultStyle: {
                        alignment: 'justify',
                        font: 'Roboto'
                    }
                }
                
                pdfMake.createPdf(formPdf).download();
            break

        }

        await pause()

    } while (opt !== '0');
    



}

main();