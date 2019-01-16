// This file is to take notes on things I'm learning, and include example code

// Design patterns

// Factory pattern. You coulde use a class:


class Dog {
  constructor() {
    this.sound = 'woof'
  }
  talk() {
    console.log(this.sound)
  }
}
const sniffles = new Dog()
sniffles.talk() // Outputs: "woof"

// But calling the funciton from elsewhere requires messing with 'this' to get thigns right:

$('button.myButton').click(sniffles.talk.bind(sniffles));

// Instead of making the object via the class, why not just return the desired object?

const dog = () => {
  const sound = 'woof'
  return {
    talk: () => console.log(sound)
  }
}
const sniffles = dog() // Calling the function dog, returning the object to assign as sniffles. 
sniffles.talk() // Outputs: "woof"

// This is called a factory. Result is that you don't have to worry about 'this':

$('button.myButton').click(sniffles.talk)



// Constructor pattern

// we define a constructor for Person objects
function Person(name, age, isDeveloper) {
  this.name = name;
  this.age = age;
  this.isDeveloper = isDeveloper || false;

  this.writesCode = function() {
    console.log(this.isDeveloper? "This person does write code" : "This person does not write code");
  }
} 

// This works, but each New Person makes a new copy of 'writes code'. We can add the method to the function prototype to avoid this: 

function Person(name, age, isDeveloper) {
  this.name = name;
  this.age = age;
  this.isDeveloper = isDeveloper || false;
}

Person.prototype.writesCode = function() { // we extend the function's prototype
  console.log(this.isDeveloper? "This person does write code" : "This person does not write code");
}

// That way there's only one shared function 'writesCode'. 






// Module pattern

// JS is the rare Object-Oriented language that doesn't support publicd and private methods and data. 
// A workaround is the module pattern, where IIFE's return functions (public), that have access to private data and methods. EG: 


// through the use of a closure we expose an object
// as a public API which manages the private objects array
var collection = (function() {
  // private members
  var objects = [];

  // public members
  return {
      addObject: function(object) {
          objects.push(object);
      },
      removeObject: function(object) {
          var index = objects.indexOf(object);
          if (index >= 0) {
              objects.splice(index, 1);
          }
      },
      getObjects: function() {
          return JSON.parse(JSON.stringify(objects));
      }
  };
})();

collection.addObject("Bob");
collection.addObject("Alice");
collection.addObject("Franck");
// prints ["Bob", "Alice", "Franck"]
console.log(collection.getObjects());
collection.removeObject("Alice");
// prints ["Bob", "Franck"]
console.log(collection.getObjects());




// Singleton method

// When you want exactly one instance of a class. The advantage here is that you can pull out one value that is always the same.
// What I don't quite get is why you don't just directly declare what you want. But here, you can keep referencing it, and 'it' can be complex. 

var singleton = (function() {
  // private singleton value which gets initialized only once
  var config;

  function initializeConfiguration(values){
      this.randomNumber = Math.random();
      values = values || {};
      this.number = values.number || 5;
      this.size = values.size || 10;
  }

  // we export the centralized method for retrieving the singleton value
  return {
      getConfig: function(values) {
          // we initialize the singleton value only once
          if (config === undefined) {
              config = new initializeConfiguration(values);
          }

          // and return the same config value wherever it is asked for
          return config;
      }
  };
})();

var configObject = singleton.getConfig({ "size": 8 });
// prints number: 5, size: 8, randomNumber: someRandomDecimalValue
console.log(configObject);
var configObject1 = singleton.getConfig({ "number": 8 });
// prints number: 5, size: 8, randomNumber: same randomDecimalValue as in first config
console.log(configObject1);




/// further notes, ripped from the internet: Design patterns can be categorized in multiple ways, but the most popular one is the following:

// Creational Design Patterns
// These patterns deal with object creation mechanisms which optimize object creation compared to a basic approach. The basic form of object creation could result in design problems or in added complexity to the design. Creational design patterns solve this problem by somehow controlling object creation. Some of the popular design patterns in this category are:

// Factory method
// Abstract factory
// Builder
// Prototype
// Singleton



// Structural Design Patterns
// These patterns deal with object relationships. They ensure that if one part of a system changes, the entire system doesn’t need to change along with it. The most popular patterns in this category are:

// Adapter
// Bridge
// Composite
// Decorator
// Facade
// Flyweight
// Proxy



// Behavioral Design Patterns
// These types of patterns recognize, implement, and improve communication between disparate objects in a system. They help ensure that disparate parts of a system have synchronized information. Popular examples of these patterns are:

// Chain of responsibility
// Command
// Iterator
// Mediator
// Memento
// Observer
// State
// Strategy
// Visitor



// Concurrency Design Patterns
// These types of design patterns deal with multi-threaded programming paradigms. Some of the popular ones are:

// Active object
// Nuclear reaction
// Scheduler