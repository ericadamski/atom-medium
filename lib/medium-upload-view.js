'use babel';

const $ = jQuery = require('jquery');

export default class MediumUploadView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('medium-upload');

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
    msgContainer.classList.add('medium-upload-info');

    const userContainer = document.createElement('div');
    userContainer.classList.add('medium-upload-info-user');

    const textContainer = document.createElement('div');
    textContainer.classList.add('medium-upload-info-text');

    const userImage = document.createElement('div');
    userImage.classList.add('medium-upload-info-user-image');

    const username = document.createElement('div');
    username.classList.add('medium-upload-info-text-name');
    username.classList.add('text-highlight');

    userContainer.appendChild(userImage);

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The MediumUpload package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    message.classList.add('text-highlight');
    message.classList.add('medium-upload-info-text-state');

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
    $('.medium-upload-info-text-state').html(state);
  }

  updateView (user, state) {
    this.user = user;
    let username = $('.medium-upload-info-text-name');
    username.html(user.username);

    let userImage = $('.medium-upload-info-user-image');
    userImage.css({
      'background': `url(${user.imageUrl}) no-repeat center`,
      'background-size': 'contain'
    });

    let message = $('.medium-upload-info-text-state');
    message.html(state);
  }

  attachHandlers (publicHandler, draftHandler) {
    $('.medium-public-btn').on('click', publicHandler);
    $('.medium-draft-btn').on('click', draftHandler);
  }

}
