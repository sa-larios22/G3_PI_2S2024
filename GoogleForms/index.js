const path = require('path');
const {google} = require('googleapis');
const QRCode = require('qrcode')



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
                responseQuizArray = await getDataFromForm(forms, quizId);
                responseQuizArray.map((response) => {
                    let i = 0;
                    for (const [key, value] of Object.entries(response.answers)) {
                        if (i === 0) {
                            console.log('Estudiante'.red);
                        }
                        console.log(`Pregunta ${i+1}: ${value.textAnswers.answers[0].value}`.cyan);
                        if (i === 2) {
                            i = 0;
                        }
                        i++;
                    }
                })
                
            break
            
            case '8':
                responseFormArray = await getDataFromForm(forms, formIdF);
                responseFormArray.map((response) => {
                    let i = 0;
                    for (const [key, value] of Object.entries(response.answers)) {
                        if (i === 0) {
                            console.log('Estudiante'.blue);
                        }
                        if (value.textAnswers.answers.length > 1) {
                            let text = `Pregunta ${i+1}: `;
                            value.textAnswers.answers.forEach((answer, idx) => {
                                text += (idx === (value.textAnswers.answers.length - 1)) ? `${answer.value}` : `${answer.value}, `;
                            })
                            console.log(text.cyan);
                        } else {
                            console.log(`Pregunta ${i+1}: ${value.textAnswers.answers[0].value}`.cyan);
                        }
                        i++
                    }
                })
            break

        }

        await pause()

    } while (opt !== '0');
    



}

main();