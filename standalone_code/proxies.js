
class Greetings {
    english() {
        return 'hello';
    }

    spanish() {
        return 'hola';
    }
}

class MoreGreetings {
    german(){
        return 'hallo';
    }

    french() {
        return 'bonjour';
    }
}

const greetings = new Greetings();
const moreGreetings = new MoreGreetings();

const allGreetings = new Proxy(moreGreetings, {
    get: function(target, property){
        return target[property]; 
    }
});

allGreetings.german // target = moreGreetings, property = value of what we are trying to get
