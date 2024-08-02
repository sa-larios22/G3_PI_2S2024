class SimpleTextQuestion {

    question = '';
    required = false;

    constructor(question, required) {
        this.question = question;
        this.required = required;
    }

    getQuestion() {
        return this.question;
    }

    getRequired() {
        return this.required;
    }

}

module.exports = SimpleTextQuestion;