const CheckQuestion = require('../models/check');
const MultipleQuestion = require('../models/multiple');
const SimpleTextQuestion = require('../models/text');

const createForm = async(forms, title) => {
    const res = await forms.forms.create({
        "resource": {
            "info": {
                "title": `${title} de Practicas Intermedias`,
                "documentTitle": `${title} de Practicas Intermedias`,
            },
        }
    });
    const formId = res.data.formId;
    const formUrl = res.data.responderUri;
    console.log(`Formulario creado con ID: ${formId}`);
    console.log(`Responder en: ${formUrl}`);
    return {
        formId,
        formUrl
    };
}

const setTitle = async(forms, formId, title) => {

    const resource = {
        includeFormInResponse: true,
        requests: [
            {
                updateFormInfo: {
                    info: {
                        title: `${title} de Practicas Intermedias`,
                        documentTitle: `${title} de Practicas Intermedias`,
                        description: `${title} creado para la presentacion de practicas intermedias del grupo 3 el ${new Date().toLocaleDateString()} con ${new Date().toLocaleTimeString()}`,
                    },
                    updateMask: '*',
                }
            },
        ],
    }

    const data = {
        "formId": formId,
        "resource": resource,
    }
    await forms.forms.batchUpdate(data);
    console.log('Titulo y descripción actualizado');
}

const setQuiz = async(forms, formId) => {

    const resource = {
        includeFormInResponse: true,
        requests: [
            {
                updateSettings: {
                    settings: {
                        quizSettings: {
                            isQuiz: true,
                        },
                    },
                    updateMask: '*',
                }
            },
        ],
    }

    const data = {
        "formId": formId,
        "resource": resource,
    }
    
    await forms.forms.batchUpdate(data);
    console.log('Quiz activado');
}

const addItemToQuiz = async(forms, formId, items = []) => {

    const questions = items.map((item, index) => {
        return {
            createItem: {
                item: {
                    title: `Pregunta ${index + 1}`,
                    description: item.getQuestion(),
                    questionItem: {
                        question: {
                            required: item.getRequired(),
                            textQuestion: {
                                paragraph: false
                            },
                            grading: {
                                pointValue: Math.round(100/items.length),
                                correctAnswers: {
                                    answers: {
                                        value: item.getAnswer().toString()
                                    }
                                }
                            }
                        }
                    }
                },
                location: {
                    index: index
                }
            },
        }
    });

    const resource = {
        includeFormInResponse: true,
        requests: questions
    }

    const data = {
        "formId": formId,
        "resource": resource,
    }

    const res = await forms.forms.batchUpdate(data);
    const questionIdResponse = res.data.replies.map((reply) => {
        return reply.createItem.itemId;
    });
    console.log('Preguntas agregadas al quiz');
    return questionIdResponse;

}

const addItemToForm = async(forms, formId, items = []) => {

    const questions = items.map((item, index) => {

        if (item instanceof SimpleTextQuestion) {
            return {
                createItem: {
                    item: {
                        title: `Pregunta ${index + 1}`,
                        description: item.getQuestion(),
                        questionItem: {
                            question: {
                                required: item.getRequired(),
                                textQuestion: {
                                    paragraph: true
                                }
                            }
                        }
                    },
                    location: {
                        index: index
                    }
                },
            }
        }

        if (item instanceof MultipleQuestion) {
            return {
                createItem: {
                    item: {
                        title: `Pregunta ${index + 1}`,
                        description: item.getQuestion(),
                        questionItem: {
                            question: {
                                required: item.getRequired(),
                                choiceQuestion: {
                                    type: "RADIO",
                                    shuffle: true,
                                    options: [
                                        {
                                            value: item.getOptions1()
                                        },
                                        {
                                            value: item.getOptions2()
                                        }
                                    ]

                                }
                            }
                        }
                    },
                    location: {
                        index: index
                    }
                },
            }
        }

        if (item instanceof CheckQuestion) {
            return {
                createItem: {
                    item: {
                        title: `Pregunta ${index + 1}`,
                        description: item.getQuestion(),
                        questionItem: {
                            question: {
                                required: item.getRequired(),
                                choiceQuestion: {
                                    type: "CHECKBOX",
                                    shuffle: true,
                                    options: [
                                        {
                                            value: item.getOptions1()
                                        },
                                        {
                                            value: item.getOptions2()
                                        },
                                        {
                                            value: item.getOptions3()
                                        }
                                    ]

                                }
                            }
                        }
                    },
                    location: {
                        index: index
                    }
                },
            }
        }

    });

    const resource = {
        includeFormInResponse: true,
        requests: questions
    }

    const data = {
        "formId": formId,
        "resource": resource,
    }

    const res = await forms.forms.batchUpdate(data);
    const questionIdResponse = res.data.replies.map((reply) => {
        return reply.createItem.itemId;
    });
    return questionIdResponse;
}

const getDataFromForm = async(forms, formId) => {
    const res = await forms.forms.responses.list({
        "formId": formId,
    });

    console.log('Datos del formulario');
    return res.data.responses;
}

module.exports = {
    createForm,
    setQuiz,
    addItemToQuiz,
    setTitle,
    addItemToForm,
    getDataFromForm
};