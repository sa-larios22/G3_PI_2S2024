class MultipleQuestion {

    question = '';
    options1 = '';
    options2 = '';
    required = false;

    constructor(question, options1, options2, required) {
        this.question = question;
        this.options1 = options1;
        this.options2 = options2;
        this.required = required;
    }

    getQuestion() {
        return this.question;
    }

    setQuestion(question) {
        this.question = question;
    }

    getOptions1() {
        return this.options1;
    }

    setOptions1(options1) {
        this.options1 = options1;
    }

    getOptions2() {
        return this.options2;
    }

    setOptions2(options2) {
        this.options2 = options2;
    }

    getOptions() {
        return [this.options1, this.options2];
    }

    getRequired() {
        return this.required;
    }
}

module.exports = MultipleQuestion;