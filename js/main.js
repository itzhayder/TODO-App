// ----------  TASK Controller  ----------

let taskController = (function() {
  let Task = function(id, text) {
    this.id = id;
    this.text = text;
    this.done = false;
    this.remove = false;
  };

  let taskList = [];

  return {
    addTask: function(text) {
      let _id;
      if (taskList.length > 0) {
        _id = taskList[taskList.length - 1].id + 1;
      } else {
        _id = 0;
      }
      let task = new Task(_id, text);
      taskList.push(task);
      return task;
    },

    testing: function() {
      return taskList;
    }
  };
})();

// ----------  UI Controller  ----------

let uiController = (function() {
  let domStrings = {
    circle: ".circle",
    remove: ".remove",
    plus: "#plus",
    userInput: "#user-input",
    list: "#list",
    container: ".list-container",
    lineThrough: "line-through"
  };

  return {
    getInput: function() {
      return {
        text: document.querySelector(domStrings.userInput).value
      };
    },

    getListElement: function() {
      let list = document.querySelector(domStrings.list);
      return list;
    },

    addTask: function(task) {
      let html = `<li id="task-${task.id}">
                            <div class="circle">
                                <img src="./images/Circle.png" alt="Circle">
                            </div>
                            <p>${task.text}</p>
                            <div class="remove">
                                <img src="./images/Remove.png" alt="Remove">
                            </div>
                        </li>`;
      let list = this.getListElement();
      list.insertAdjacentHTML("beforeend", html);
    },

    completeTask: function(id) {
      try {
        let el = document.getElementById(id);
        // for remove
        // el.parentNode.removeChild(el);
        let childEl = el.children;
        console.log(childEl[1]);
        // childEl[1].classList.toggle(domStrings.circle);
        childEl[1].classList.toggle(domStrings.lineThrough);
      } catch (err) {}
    },

    getDOM: function() {
      return domStrings;
    }
  };
})();

// ----------  APP Controller  ----------

let appController = (function(tCtrl, uiCtrl) {
  function startApp() {
    let dom = uiCtrl.getDOM();
    console.log("App started successfully...");

    // Add Item
    let addItem = function() {
      // Get Input
      let input = uiCtrl.getInput();

      if (input.text) {
        // Add in task controller
        newTask = tCtrl.addTask(input.text);

        // Add to ui controller
        uiCtrl.addTask(newTask);

        // Clear the text field
        document.querySelector(dom.userInput).value = "";
      }

      console.log(tCtrl.testing());
    };

    // Complete Item
    let completeItem = function(event) {
      let target = event.target.parentNode.parentNode.id;
      if (target !== "list") {
        // Complete from task controller

        // Complete from ui controller
        uiCtrl.completeTask(target);
      }
    };

    document.querySelector(dom.plus).addEventListener("click", addItem);
    document.body.addEventListener("keypress", event => {
      if (event.keyCode === 13) {
        addItem();
      }
    });

    document
      .querySelector(dom.container)
      .addEventListener("click", completeItem);
  }

  return {
    startApp: function() {
      startApp();
    }
  };
})(taskController, uiController);

appController.startApp();
