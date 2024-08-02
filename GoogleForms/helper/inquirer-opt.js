const inquirer = require('inquirer');
require('colors');

const questionsOptions = [
    {
        type: 'list',
        name: 'option',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: '1',
                name: `${ '1.'.red } Leer Excel de quiz`
            },
            {
                value: '2',
                name: `${ '2.'.green } Leer Excel de formulario`
            },
            {
                value: '3',
                name: `${ '3.'.yellow } Crear quiz`
            },
            {
                value: '4',
                name: `${ '4.'.blue } Crear formulario`
            },
            {
                value: '5',
                name: `${ '5.'.magenta } Agregar preguntas a quiz`
            },
            {
                value: '6',
                name: `${ '6.'.cyan } Agregar preguntas a formulario`
            },
            {
                value: '7',
                name: `${ '7.'.white } Generar reporte de quiz`
            },
            {
                value: '8',
                name: `${ '8.'.rainbow } Generar reporte de formulario`
            },
            {
                value: '0',
                name: `${ '0.'.green } Salir`
            },
        ]
    }
]

const pause = async() => {

    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${ 'ENTER'.america } para continuar`
        }
    ]

    console.log('\n');
    await inquirer.prompt( question );

}

const inquirerMenu = async() => {

    console.clear();
    
    console.log( "==========================".green );
    console.log("  Seleccione una opción  ".white );
    console.log( "==========================\n".green );

    const { option } = await inquirer.prompt( questionsOptions );

    return option;
}

const readInput = async( message ) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if( value.length === 0 ){
                    return 'Por favor, ingrese un valor'
                }

                return true
            }
        }
    ]

    const { desc } = await inquirer.prompt(question)

    return desc;
}

module.exports = {
    inquirerMenu,
    pause,
    readInput
}