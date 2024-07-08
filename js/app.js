//Authentication Form Switch
const formSwitches = document.querySelectorAll(".form-switch p");
const loginForm = document.querySelector(".login-form");
const regForm = document.querySelector(".reg-form");
const switchedClass = "switched";

formSwitches.forEach(
    (c) =>
        (c.onclick = (e) => {
            formSwitches.forEach((c) =>
                c.classList[e.target == c ? "toggle" : "remove"](switchedClass)
            );
            if (e.target.classList[0] === "reg-switch") {
                regForm.style.display = "block";
                loginForm.style.display = "none";
            } else {
                regForm.style.display = "none";
                loginForm.style.display = "block";
            }
        })
);

// AUTHENTICATION PROCESS
//User Registration
const authWindow = document.querySelector(".auth-container");
const regFormBtn = document.querySelector(".reg-form button");
const loginFormBtn = document.querySelector(".login-form button");
const regFormAlert = document.querySelector(".reg-form .msg-alert");
const loginFormAlert = document.querySelector(".login-form .msg-alert");
const fieldEmptyMsg = "Please fill all fields before submitting.";
const regFailedMsg = "Email already exists. Try again.";
const loginFailedMsg = "User details are incorrect. Try again";
const regSuccessMsg = "Registration Successful! You can now proceed to login.";
let allUsers = [];
let allTodos = [];

//Retreiving available users and todos from localStorage
if (localStorage.getItem("users") == null) {
    localStorage.setItem("users", JSON.stringify(allUsers));
    localStorage.setItem("todos", JSON.stringify(allTodos));
} else {
    allUsers = JSON.parse(localStorage.getItem("users"));
    allTodos = JSON.parse(localStorage.getItem("todos"));
}

//The NewUser class
class NewUser {
    constructor(name, email, city, job, userHandle) {
        this.fullName = name;
        this.userEmail = email;
        this.jobTitle = job;
        this.userCity = city;
        this.userHandle = userHandle;
    }
}

// Initial Empty todo list
class NewUserTodoList {
    constructor(handle, myTodoList) {
        this.handle = handle;
        this.myTodoList = myTodoList;
    }
}

//Creating an array of available user emails for login and registration validation
const allUserNames = [];
const allUserEmails = [];
allUsers.forEach((user) => {
    allUserNames.push(user.fullName);
    allUserEmails.push(user.userEmail);
});

//Alert Message for Registration Form
const displayRegistrationStatusMessage = (color, msg) => {
    regFormAlert.textContent = msg;
    regFormAlert.style.color = color;
    regFormAlert.style.display = "block";
    regFormAlert.style.opacity = 1;
};

//Alert Message for Login Form
const displayLoginStatusMessage = (color, msg) => {
    loginFormAlert.textContent = msg;
    loginFormAlert.style.color = color;
    loginFormAlert.style.display = "block";
    loginFormAlert.style.opacity = 1;
};

// User creation function
const userCreation = () => {
    //Creating userHandle from the submitted email
    let userHandle = document.querySelector("#reg-email").value.split("@")[0];

    const newUser = new NewUser(
        `${document.querySelector("#reg-fullname").value}`,
        `${document.querySelector("#reg-email").value}`,
        `${document.querySelector("#location").value}`,

        `${document.querySelector("#job").value}`,
        `@${userHandle}`
    );

    const newUserTodoList = new NewUserTodoList(`@${userHandle}`, []);

    //Appending the new user and an empty array of todos to the list of available users and saving to locaStorage
    allUsers.push(newUser);
    allTodos.push(newUserTodoList);
    localStorage.setItem("users", JSON.stringify(allUsers));
    localStorage.setItem("todos", JSON.stringify(allTodos));
    document.querySelector(".auth-loader").style.width = "100%";
    setTimeout(() => {
        location.reload();
    }, 4000);
};

// document.querySelector("#login-email").value.split("@")[0];
//User Data Query Function for Successfully Loggedin Users
const queryUserData = (userhandle) => {
    let userHandle = userhandle;
    let todos;
    let jobtitle;
    let city;
    let fullName;
    allTodos.forEach((userTodos) => {
        if (userTodos.handle === `@${userHandle}`) {
            todos = userTodos.myTodoList;
        }
    });
    allUsers.forEach((user) => {
        if (user.userHandle === `@${userHandle}`) {
            jobtitle = user.jobTitle;
        }
    });
    allUsers.forEach((user) => {
        if (user.userHandle === `@${userHandle}`) {
            city = user.userCity;
        }
    });
    allUsers.forEach((user) => {
        if (user.userHandle === `@${userHandle}`) {
            fullName = user.fullName;
        }
    });

    const loggedUserDetails = {
        fullname: fullName,
        jobTitle: jobtitle,
        city: city,
        handle: `@${userHandle}`,
        myTodos: todos,
    };

    return loggedUserDetails;
};

//Appending  new todo item to the list
const appendTodo = (todoObject) => {
    const todoItem = document.createElement("li");
    const todoText = document.createElement("p");
    const todoItemStatus = document.createElement("p");
    let todoStatus;
    todoItem.classList.add("task-item");
    todoText.classList.add("task-text");
    if (todoObject.todoStatus === false) {
        todoStatus = "bi-clock-history";
        todoItemStatus.classList.add("task-status");
    } else {
        todoStatus = "bi-check-all";
        todoItemStatus.classList.add("task-status");
        todoItemStatus.classList.add("task-status-complete");
    }
    todoText.textContent = todoObject.todoTextContent;
    todoItemStatus.innerHTML = `<i class='bi ${todoStatus}'></i>`;
    todoItem.appendChild(todoText);
    todoItem.appendChild(todoItemStatus);
    document.querySelector(".all-tasks-list").appendChild(todoItem);
};

//Alert Message for New Todo
const newTodoAlertMessage = (color, msg) => {
    document.querySelector(".todo-form .msg-alert").textContent = msg;
    document.querySelector(".todo-form .msg-alert").style.color = color;
    document.querySelector(".todo-form .msg-alert").style.display = "block";
    document.querySelector(".todo-form .msg-alert").style.opacity = 1;
};

//WEATHER API HANDLING
const getWeatherData = (location) => {
    const currentIcon = document.querySelector(".now-icon img");
    const tempDeg = document.querySelector(".temp-location .temp");
    const weatherSummary = document.querySelector(
        ".temp-location .weather-summary"
    );
    const locationCity = document.querySelector(
        ".temp-location .location-city"
    );
    const locationCountry = document.querySelector(
        ".temp-location .location-country"
    );
    const locationTime = document.querySelector(
        ".temp-location .location-time"
    );
    const humidityValue = document.querySelector(".humidity .value");
    const sunriseValue = document.querySelector(".sunrise .value");

    const api = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=cfc840835a1086dfdb2fb1f1dc59de3c&units=imperial`;

    fetch(api)
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            let { temp, humidity } = response.main;
            let city = response.name;
            let description = response.weather[0].description;
            let { sunrise, country } = response.sys;
            let tempToDeg = (temp - 32) * 0.5555;

            tempDeg.innerHTML = `${Math.floor(tempToDeg)}&deg;C`;
            weatherSummary.textContent = description;
            locationCity.textContent = city;
            locationCountry.textContent = country;
            locationTime.textContent = `as at ${new Date(
                response.dt * 1000
            ).toLocaleTimeString()}`;
            humidityValue.textContent = `${humidity}%`;
            sunriseValue.textContent = new Date(
                sunrise * 1000
            ).toLocaleTimeString();

            function setIcons(description) {
                const icons = {
                    "clear sky": "01d@2x.png",
                    "few clouds": "02d@2x.png",
                    "scattered clouds": "03d@2x.png",
                    "broken clouds": "04d@2x.png",
                    "shower rain": "09d@2x.png",
                    rain: "10d@2x.png",
                    thunderstorm: "11d@2x.png",
                    snow: "13d@2x.png",
                    mist: "50d@2x.png",
                };

                switch (description) {
                    case "clear sky":
                        currentIcon.setAttribute(
                            "src",
                            `http://openweathermap.org/img/wn/${icons["clear sky"]}`
                        );
                        break;
                    case "few clouds":
                        currentIcon.setAttribute(
                            "src",
                            `http://openweathermap.org/img/wn/${icons["few clouds"]}`
                        );
                        break;
                    case "scattered clouds":
                        currentIcon.setAttribute(
                            "src",
                            `http://openweathermap.org/img/wn/${icons["scattered clouds"]}`
                        );
                        break;
                    case "broken clouds":
                        currentIcon.setAttribute(
                            "src",
                            `http://openweathermap.org/img/wn/${icons["broken clouds"]}`
                        );
                        break;
                    case "shower rain":
                        currentIcon.setAttribute(
                            "src",
                            `http://openweathermap.org/img/wn/${icons["shower rain"]}`
                        );
                        break;
                    case "rain":
                        currentIcon.setAttribute(
                            "src",
                            `http://openweathermap.org/img/wn/${icons.rain}`
                        );
                        break;
                    case "thunderstorm":
                        currentIcon.setAttribute(
                            "src",
                            `http://openweathermap.org/img/wn/${icons.thunderstorm}`
                        );
                        break;
                    case "snow":
                        currentIcon.setAttribute(
                            "src",
                            `http://openweathermap.org/img/wn/${icons.snow}`
                        );
                        break;
                    case "mist":
                        currentIcon.setAttribute(
                            "src",
                            `http://openweathermap.org/img/wn/${icons.mist}`
                        );
                        break;

                    default:
                        currentIcon.setAttribute(
                            "src",
                            `./img/partly-cloudy.png`
                        );
                        break;
                }
            }

            setIcons(description);
        })
        .catch((err) => console.error(err));
};

const mainAppActiviy = (uh) => {
    let userhandle = uh;
    //Query User Data for the Logged in User
    let userData = queryUserData(userhandle);

    getWeatherData(userData.city);
    //INSERT USER DATA INTO DOM
    // 1. Profile Data
    document.querySelector(".profile-card .user-name").textContent =
        userData.fullname;
    document.querySelector(".profile-card .job-title").textContent =
        userData.jobTitle;
    document.querySelector(".profile-card .user-handle").textContent =
        userData.handle;

    // 2. Task List
    userData.myTodos.forEach((todo) => {
        appendTodo(todo);
    });

    //Profile menu toggle
    const profileMenuOpenBtn = document.querySelector("#profile-options");
    const profileMenuCloseBtn = document.querySelector(
        ".profile-options-container i"
    );
    profileMenuOpenBtn.addEventListener("click", () => {
        document
            .querySelector(".profile-options-container")
            .classList.add("open-profile-options");
    });
    profileMenuCloseBtn.addEventListener("click", () => {
        document
            .querySelector(".profile-options-container")
            .classList.remove("open-profile-options");
    });

    //Profile edit container toggle and processing
    const profileEditOpenBtn = document.querySelector("#pe-open");
    const profileEditCloseBtn = document.querySelector("#pe-close");
    const profileEditBtn = document.querySelector("#pe-submit");
    profileEditOpenBtn.addEventListener("click", () => {
        document
            .querySelector(".profile-edit-container")
            .classList.add("open-profile-edit");
        document.querySelector("#new-name").value =
            document.querySelector(".user-name").textContent;
        document.querySelector("#new-job").value =
            document.querySelector(".job-title").textContent;
    });
    profileEditCloseBtn.addEventListener("click", () => {
        document
            .querySelector(".profile-edit-container")
            .classList.remove("open-profile-edit");
    });
    profileEditBtn.addEventListener("click", (e) => {
        e.preventDefault();

        allUsers.forEach((user) => {
            if (
                user.userHandle ===
                `${document.querySelector(".user-handle").textContent}`
            ) {
                user.fullName = document.querySelector("#new-name").value;
                user.jobTitle = document.querySelector("#new-job").value;
            }
        });

        localStorage.setItem("users", JSON.stringify(allUsers));
        sessionStorage.clear();
        document
            .querySelector(".profile-edit-alert")
            .classList.add("open-pe-alert");
        setTimeout(() => {
            location.reload();
        }, 4000);
    });

    //CREATION OF NEW TASKS
    const newTodoBtn = document.querySelector(".todo-form button");

    newTodoBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (document.querySelector("#new-todo").value === "") {
            newTodoAlertMessage("red", fieldEmptyMsg);
            setTimeout(() => {
                document.querySelector(".todo-form .msg-alert").style.display =
                    "none";
            }, 3000);
        } else {
            const newTodo =
                document.querySelector("#new-todo").value +
                ` ${document.querySelector("#new-todo-desc").value}`;

            let newTodoObject = {
                todoTextContent: `${newTodo}`,
                todoStatus: false,
            };

            appendTodo(newTodoObject);

            document.querySelectorAll(".todo-form input").forEach((i) => {
                i.value = "";
            });
            //Add the current tasks list to localStorage
            let userCurrentTodos = [];

            let isComplete;
            document.querySelectorAll(".all-tasks-list li").forEach((item) => {
                if (
                    item.lastElementChild.firstElementChild.classList[1] ===
                    "bi-clock-history"
                ) {
                    isComplete = false;
                } else {
                    isComplete = true;
                }
                let todoObject = {
                    todoTextContent: item.firstElementChild.textContent,
                    todoStatus: isComplete,
                };
                userCurrentTodos.push(todoObject);
            });

            allTodos.forEach((u) => {
                if (u.handle === userData.handle) {
                    u.myTodoList = userCurrentTodos;
                }
            });
            localStorage.setItem("todos", JSON.stringify(allTodos));
            location.reload();
            newTodoAlertMessage("green", "Task added successfully.");
            setTimeout(() => {
                document.querySelector(".todo-form .msg-alert").style.display =
                    "none";
            }, 3000);
        }
    });

    //TASK ITEM CTA: Changing Status, Editing and Deleting
    //Changing todo status
    document.querySelectorAll(".all-tasks-list li").forEach((item) => {
        const todoStatusBtn = item.lastElementChild;
        todoStatusBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (
                todoStatusBtn.firstElementChild.classList[1] ===
                "bi-clock-history"
            ) {
                todoStatusBtn.innerHTML = `<i class='bi bi-check-all'></i>`;
                todoStatusBtn.classList.add("task-status-complete");
            } else {
                todoStatusBtn.innerHTML = `<i class='bi bi-clock-history'></i>`;
                todoStatusBtn.classList.remove("task-status-complete");
            }
        });
    });

    //Editing of todo text content
    document.querySelectorAll(".all-tasks-list li").forEach((item) => {
        item.addEventListener("dblclick", (e) => {
            e.preventDefault();
            document.querySelector("#new-todo").value =
                item.firstElementChild.textContent;
            item.classList.add("task-fadeout");
            setTimeout(() => {
                item.remove();
            }, 500);
        });
    });

    //User Logout
    document.querySelector("#app-logout").addEventListener("click", () => {
        sessionStorage.clear();
        location.reload();
    });
};

//User Registration Process
regFormBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (
        document.querySelector("#reg-fullname").value === "" ||
        document.querySelector("#reg-email").value === "" ||
        document.querySelector("#job").value === ""
    ) {
        displayRegistrationStatusMessage("red", fieldEmptyMsg);
        setTimeout(() => {
            regFormAlert.style.display = "none";
        }, 3000);
    } else if (
        allUserEmails.includes(document.querySelector("#reg-email").value)
    ) {
        displayRegistrationStatusMessage("red", regFailedMsg);
        setTimeout(() => {
            regFormAlert.style.display = "none";
        }, 3000);
    } else {
        userCreation();
        document.querySelectorAll(".reg-form input").forEach((inputField) => {
            inputField.value = "";
        });
        displayRegistrationStatusMessage("green", regSuccessMsg);
        setTimeout(() => {
            regFormAlert.style.display = "none";
        }, 4000);
    }
});

//User Login Process
loginFormBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (
        document.querySelector("#login-fullname").value === "" ||
        document.querySelector("#login-email").value === ""
    ) {
        //Alert for Empty Fields Submitted
        displayLoginStatusMessage("red", fieldEmptyMsg);
        setTimeout(() => {
            loginFormAlert.style.display = "none";
        }, 3000);
    } else if (
        //Making sure the submitted details match what's in the localStorage
        allUserEmails.includes(document.querySelector("#login-email").value) &&
        allUserNames.includes(
            document.querySelector("#login-fullname").value
        ) &&
        allUserEmails.indexOf(
            document.querySelector("#login-email").value ===
                allUserNames.indexOf(
                    document.querySelector("#login-fullname").value
                )
        )
    ) {
        //All Checks out, proceed to log the user in
        document.querySelector(".auth-loader").style.width = "100%";
        setTimeout(() => {
            document.querySelector(".container").style.display = "flex";
            authWindow.style.display = "none";
        }, 3000);
        //Open a user session
        const userSession = {
            username: `${
                document.querySelector("#login-email").value.split("@")[0]
            }`,
            sessionID: `${Math.floor(Math.random() * 2000)}${
                document.querySelector("#login-email").value.split("@")[0]
            }${new Date().getTime()}`,
        };
        sessionStorage.setItem("currentUser", JSON.stringify(userSession));
        let uh = userSession.username;
        // Logged in user acitivities
        mainAppActiviy(uh);
    } else {
        //Alert for Incorrect User Details
        displayLoginStatusMessage("red", loginFailedMsg);
        setTimeout(() => {
            loginFormAlert.style.display = "none";
        }, 3000);
    }
});

let currentUserSession;
if (sessionStorage.getItem("currentUser")) {
    currentUserSession = JSON.parse(sessionStorage.getItem("currentUser"));
    document.querySelector(".container").style.display = "flex";
    authWindow.style.display = "none";
    let uh = `${currentUserSession.username}`;
    mainAppActiviy(uh);
}
