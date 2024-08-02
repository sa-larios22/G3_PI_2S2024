class CheckQuestion {

    question = '';
    options1 = '';
    options2 = '';
    options3 = '';
    required = false;

    constructor(question, options1, options2, options3, required) {
        this.question = question;
        this.options1 = options1;
        this.options2 = options2;
        this.options3 = options3;
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

    getOptions3() {
        return this.options3;
    }

    setOptions3(options3) {
        this.options3 = options3;
    }

    getOptions() {
        return [this.options1, this.options2, this.options3];
    }

    getRequired() {
        return this.required;
    }

}
module.exports = CheckQuestion;