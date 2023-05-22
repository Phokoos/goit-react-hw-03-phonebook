import { Component } from 'react';
import { nanoid } from 'nanoid';

import css from './App.module.css';

import ContactForm from './ContactForm/contactForm';
import ContactList from './ContactList/contactList';
import Filter from './Filter/filter';

const LOCAL_CONTACTS_LIST = 'contactsList';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  formSubmit = event => {
    event.preventDefault();

    const { contacts } = this.state;
    const { name, number } = event.target;

    if (
      contacts
        .map(contact => contact.name.toLowerCase())
        .includes(name.value.toLowerCase())
    ) {
      return alert(`Name ${name.value} is already here`);
    }

    this.setState({
      contacts: [
        ...contacts,
        {
          id: nanoid(),
          name: name.value,
          number: number.value,
        },
      ],
    });

    event.currentTarget.reset();
  };

  componentDidMount() {
    let localData = [];
    try {
      localData = JSON.parse(localStorage.getItem(LOCAL_CONTACTS_LIST));
    } catch (error) {
      console.log(error);
    }

    if (localData) {
      if (localData !== []) {
        this.setState({
          contacts: [...localData.contacts],
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { contacts } = this.state;

    if (prevState.contacts.length !== contacts.length)
      localStorage.setItem(LOCAL_CONTACTS_LIST, JSON.stringify({ contacts }));
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  removeContacts = event => {
    const { contacts } = this.state;
    const { id } = event.currentTarget.parentElement;

    this.setState({
      contacts: contacts.filter(contact => contact.id !== id),
    });
  };

  render() {
    return (
      <div className={css.phonebook}>
        <h1 className={css.phonebook__title}>Phonebook</h1>
        <ContactForm state={this.state} formSubmit={this.formSubmit} />

        <h2 className={css.phonebook__contactsTitle}>Contacts</h2>
        <Filter
          contacts={this.state.contacts}
          filter={this.state.filter}
          handleInputChange={this.handleInputChange}
        />
        <ContactList
          contacts={this.state.contacts}
          filter={this.state.filter}
          removeContacts={this.removeContacts}
        />
      </div>
    );
  }
}

export default App;
