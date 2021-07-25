const newTask = document.querySelector('.new-task');
const textNewTask = newTask.querySelector('textarea');
const addTaskButton = newTask.querySelector('.new-task__btn');
const taskListContainer = document.querySelector('.task__list');
const navList = document.querySelector('.nav__list');
let childrenTaskList = taskListContainer.children;
const searchTask = document.querySelector('.header__input');

const isTextNewTask = (text) => {
  return text.match(/[^\s\p{P}]/gu) === null;
};

const renderTexsk = (text) => {
  return `<li class="task__item">
  <span>${text}</span>
  <button class="button__mark not-important">MARK IMPORTANT</button>
  <button class="button__delete">
    <img src="img/delete.svg" alt="Delete" />
  </button>
</li>`;
};

// const isTaskList = () => {
//   return taskContainer.querySelector('.task__list');
// };

// const addTeaskList = () => {
//   let taskList = document.createElement('ul');
//   taskList.classList.add('task__list');
//   taskContainer.append(taskList);
// };

const createTask = () => {
  if (isTextNewTask(textNewTask.value)) {
    textNewTask.value = '';
    return;
  }
  // if (!isTaskList()) addTeaskList();

  taskListContainer.insertAdjacentHTML(
    'beforeend',
    renderTexsk(textNewTask.value)
  );
  textNewTask.value = '';
};

// const toggleTask = (tag, classAdd) => {
//   tag.classList.contains(classAdd)
//     ? tag.classList.remove(classAdd)
//     : tag.classList.add(classAdd);
// };

const changeTask = (evt) => {
  let markButton = evt.target.closest('button.button__mark');
  let deleteButton = evt.target.closest('button.button__delete');
  let taskLi = evt.target.closest('li');

  if (markButton) {
    taskLi.classList.toggle('important');
    return;
  }
  if (deleteButton) {
    taskLi.remove();
  }
  if (taskLi) {
    taskLi.classList.toggle('done');
    let selectSort = navList.querySelector('.active').dataset.action;
    sortTaskList(selectSort);
  }
};

const sortTaskList = (classSort) => {
  if (classSort === 'done') {
    textNewTask.parentElement.style.display = 'none';
    for (const element of childrenTaskList) {
      element.removeAttribute('style');
      if (!element.classList.contains('done')) {
        element.style.display = 'none';
      }
    }
  } else if (classSort === 'active') {
    textNewTask.parentElement.removeAttribute('style');
    for (const element of childrenTaskList) {
      element.removeAttribute('style');
      if (element.classList.contains('done')) {
        element.style.display = 'none';
      }
    }
  } else {
    textNewTask.parentElement.removeAttribute('style');
    for (const element of childrenTaskList) {
      element.removeAttribute('style');
    }
  }
};

const changeNav = (evt) => {
  const liNav = evt.target.closest('li');

  if (liNav.classList.contains('active')) {
    return;
  }
  navList.querySelector('.active').classList.remove('active');
  liNav.classList.add('active');
  sortTaskList(liNav.dataset.action);
};

addTaskButton.addEventListener('click', createTask);
textNewTask.addEventListener('keydown', (evt) => {
  if (evt.shiftKey) {
    return;
  }
  if (evt.key === 'Enter') {
    createTask();
  }
});
taskListContainer.addEventListener('click', changeTask);
navList.addEventListener('click', changeNav);
searchTask.addEventListener('input', (evt) => {
  let textInput = evt.target.value;
  if (childrenTaskList.length === 0) return;
  if (textInput === '') {
    for (const child of childrenTaskList) {
      child.removeAttribute('style');
    }
    return;
  }
  for (const child of childrenTaskList) {
    if (child.style.display === 'none') continue;
    let textTaskChild = child
      .querySelector('span')
      .textContent.toLocaleLowerCase();

    if (!textTaskChild.includes(textInput)) {
      child.style.display = 'none';
    }
  }
});

window.addEventListener('beforeunload', () => {
  localStorage.clear();
  let i = 0;
  for (const child of childrenTaskList) {
    localStorage.setItem(i, JSON.stringify(child.outerHTML));
    i++;
  }
});
if (localStorage.length > 0) {
  for (let i = 0; i < localStorage.length; i++) {
    let dataItemTask = localStorage.getItem(i);
    dataItemTask = JSON.parse(dataItemTask);
    taskListContainer.insertAdjacentHTML('beforeend', dataItemTask);
  }
}
