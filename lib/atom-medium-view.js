'use babel';

const $ = jQuery = require('jquery');

export default class MediumUploadView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('atom-medium');

    // Create button container
    const btnToolbar = document.createElement('div');
    btnToolbar.classList.add('btn-toolbar');

    const btnGroup = document.createElement('div');
    btnGroup.classList.add('btn-group');

    // Create buttons
    const publicBtn = document.createElement('button');
    publicBtn.classList.add('btn');
    publicBtn.classList.add('medium-public-btn');
    publicBtn.textContent = 'Public';

    const draftBtn = document.createElement('button');
    draftBtn.classList.add('btn');
    draftBtn.classList.add('medium-draft-btn');
    draftBtn.textContent = 'Draft';


    btnGroup.appendChild(publicBtn);
    btnGroup.appendChild(draftBtn);

    btnToolbar.appendChild(btnGroup);

    // Create Message Container
    const msgContainer = document.createElement('div');
    msgContainer.classList.add('atom-medium-info');

    const userContainer = document.createElement('div');
    userContainer.classList.add('atom-medium-info-user');

    const textContainer = document.createElement('div');
    textContainer.classList.add('atom-medium-info-text');

    const userImage = document.createElement('div');
    userImage.classList.add('atom-medium-info-user-image');

    const username = document.createElement('div');
    username.classList.add('atom-medium-info-text-name');
    username.classList.add('text-highlight');

    userContainer.appendChild(userImage);

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The MediumUpload package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    message.classList.add('text-highlight');
    message.classList.add('atom-medium-info-text-state');

    msgContainer.appendChild(userContainer);

    textContainer.appendChild(username);
    textContainer.appendChild(message);

    msgContainer.appendChild(textContainer);
    msgContainer.appendChild(btnToolbar);

    this.element.appendChild(msgContainer);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  updateViewState (state) {
    $('.atom-medium-info-text-state').html(state);
  }

  updateView (user, state) {
    this.user = user;
    let username = $('.atom-medium-info-text-name');
    username.html(user.username);

    let userImage = $('.atom-medium-info-user-image');
    userImage.css({
      'background': `url(${user.imageUrl}) no-repeat center`,
      'background-size': 'contain'
    });

    let message = $('.atom-medium-info-text-state');
    message.html(state);
  }

  attachHandlers (pack) {
    $('.medium-public-btn').on('click', () => pack.public());
    $('.medium-draft-btn').on('click', () => pack.draft());
  }

}
