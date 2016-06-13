'use babel';

export default class MediumUploadView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('medium-upload');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The MediumUpload package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);
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

  setUser (user, type) {
    this.element
      .children[0]
      .textContent =
        `${user.username} : Creating ${(type === 'public') ? `${type} post.` : type}`;
  }

}
