// ----------  TASK Controller  ----------

let taskController = (function () {
  let Task = function (id, text) {
    this.id = id;
    this.text = text;
    this.done = false;
  };

  let taskList = [];

  function setList(list) {
    taskList = list;
  }

  return {
    addTask: function (text) {
      let _id;
      if (taskList.length > 0) {
        _id = taskList[taskList.length - 1].id + 1;
      } else {
        _id = 0;
      }
      let task = new Task(_id, text);
      taskList.push(task);

      // Local storage set item
      localStorage.setItem("todoList", JSON.stringify(taskList));

      return task;
    },

    completeTask: function (id) {
      let taskID = id.split("-");
      taskID = taskID[1];

      for (let i of taskList) {
        if (i.id == taskID) {
          i.done = i.done ? false : true;
        }
      }
      localStorage.setItem("todoList", JSON.stringify(taskList));
    },

    removeTask: function (id) {
      let taskID = id.split("-");
      taskID = taskID[1];
      for (let i of taskList) {
        if (i.id == taskID) {
          let index = taskList.indexOf(i);
          taskList.splice(index, 1);
          localStorage.setItem("todoList", JSON.stringify(taskList));
        }
      }
    },

    getTaskList: function () {
      return taskList;
    },

    setTaskList: function (list) {
      setList(list);
    },

    testing: function () {
      return taskList;
    }
  };
})();

// ----------  UI Controller  ----------

let uiController = (function () {
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
    getInput: function () {
      return document.querySelector(domStrings.userInput).value;
    },

    getListElement: function () {
      let list = document.querySelector(domStrings.list);
      return list;
    },

    addTask: function (task) {
      let html;
      if (!task.done) {
        html = `<li id="task-${task.id}">
                            <div class="circle">
                                <img src="./images/Circle.png" alt="Circle">
                            </div>
                            <p>${task.text}</p>
                            <div class="remove">
                                <img src="./images/Remove.png" alt="Remove">
                            </div>
                        </li>`;
      } else {
        html = `<li id="task-${task.id}">
                            <div class="circle">
                                <img src="./images/Circle_Green.png" alt="Circle">
                            </div>
                            <p class="line-through">${task.text}</p>
                            <div class="remove">
                                <img src="./images/Remove.png" alt="Remove">
                            </div>
                        </li>`;
      }

      let list = this.getListElement();
      list.insertAdjacentHTML("beforeend", html);
    },

    completeTask: function (id) {
      try {
        let el = document.getElementById(id);
        // for remove
        // el.parentNode.removeChild(el);

        let childEl = el.children;
        // childEl[1].classList.toggle(domStrings.circle);
        let imgSelect = childEl[0].children[0];
        let imgSrc = imgSelect.src;
        let imgName = imgSrc.split("/");
        imgName = imgName[imgName.length - 1];

        if (imgName == "Circle.png") {
          imgSelect.src = "../images/Circle_Green.png";
        } else {
          imgSelect.src = "../images/Circle.png";
        }

        // Toggle line through
        childEl[1].classList.toggle(domStrings.lineThrough);
      } catch (err) {}
    },

    removeTask: function (id) {
      try {
        let el = document.getElementById(id);
        el.parentNode.removeChild(el);
      } catch (err) {}
    },

    getDOM: function () {
      return domStrings;
    }
  };
})();

// ----------  APP Controller  ----------

let appController = (function (tCtrl, uiCtrl) {
  function startApp() {
    let dom = uiCtrl.getDOM();
    let taskList = tCtrl.getTaskList();
    console.log("App started successfully...");

    // Local storage check
    let checkLocalStorage = async function () {
      let items = await localStorage.getItem("todoList");
      let data = await JSON.parse(items);
      if (data.length) {
        data.forEach(el => {
          uiCtrl.addTask(el);
        });
        tCtrl.setTaskList(data);
      }
    }
    checkLocalStorage();


    // Add Item
    let addItem = function () {
      // Get Input
      let input = uiCtrl.getInput();

      if (input) {
        // Add in task controller
        newTask = tCtrl.addTask(input);

        // Add to ui controller
        uiCtrl.addTask(newTask);

        // Clear the text field
        document.querySelector(dom.userInput).value = "";
      }
    };

    // Complete Item
    let modifyItem = function (event) {
      if (event.target.parentNode.classList.contains("circle")) {
        // Take the id
        let targetID = event.target.parentNode.parentNode.id;

        // Complete from task controller
        tCtrl.completeTask(targetID);
        // Complete from ui controller
        uiCtrl.completeTask(targetID);
      } else if (event.target.parentNode.classList.contains("remove")) {
        let targetID = event.target.parentNode.parentNode.id;
        uiCtrl.removeTask(targetID);
        tCtrl.removeTask(targetID);
      }
    };

    document.querySelector(dom.plus).addEventListener("click", addItem);
    document.body.addEventListener("keypress", event => {
      if (event.keyCode === 13) {
        addItem();
      }
    });

    document.querySelector(dom.container).addEventListener("click", modifyItem);
  }

  return {
    startApp: function () {
      startApp();
    }
  };
})(taskController, uiController);

appController.startApp();