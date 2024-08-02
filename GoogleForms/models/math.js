class MathQuestion {
    question = '';
    required = false;
    answer = 0;

    constructor(question, answer, required) {
        this.question = question;
        this.required = required;
        this.answer = Number(answer);
    }

    getQuestion() {
        return this.question;
    }

    getRequired() {
        return this.required;
    }

    getAnswer() {
        return Number(this.answer);
    }
}

module.exports = MathQuestion;