// ReactRedux:
// https://egghead.io/courses/getting-started-with-redux

// Principals of Redux
// 1. Single immutable state tree
// 2. State Tree is redundant
//     1. Only to change state tree is through actions
// 3. To describe state mutations, write pure function that takes the previous state, the action dispatched and return the next state of the app
//     1. This function is called the reducer

// - State tree is redundant
//     cannot modify or write to state tree
// - State is the minimal representation of the data in your app
// - Actions are the minimal representation of a change to the state
// - Modify state through actions
//     - plain JS object
//     - must include type property not equal defined
//     - Rec strings for types as it is serializable
// - Pure/Impure functions
//     - Pure has no side effects (Network/database calls)
//     - Calling pure functions with same args always returns same values
//     - Pure functions do not modify values passed to them
//     - Impure functions may overwrite values passed to them, call db, network, operate on the DOM etc
// - State mutations in app should be described as pure function
//     - takes current state and actions dispatched to return the new state
// - Reducers
//     - if the state of the application is undefined it should return the desired initial state
// - Redux Store Methods
//     - getState()
//     - discpatch()
//     - subscribe()
// - Redux.createStore()
//     - Binds together 3 principals of redux
//     - store = createStore(someReducer)
// - store.getState()
//     - retrieves current state of the store
// - store.dispatch({ type: ‘someAction’})
//     - most common store method
//     - dispatch actions to change state of app
// - store.subscribe()
//     - register a callback the redux store calls when an actions has been dispatched
//     - update ui to reflect current app state
//     - store.subscribe(() => {})
// - Implementing store from scratch
const createStore = (reducer) => {
  let state;
  let listeners;

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  }

  const subscribe = (listener) => {
    listeners.push(listener);
    // instead of discrete unsubscribe function we
    // return an unsubscribe when something subscribes
    return () => {
      listeners = listeners.filter(l => l !== listener);
    }
  }

  // Want initial state populated when the store returns
  // dispatch dummy action to get reducer to return initial val
  dispatch({});

  return { getState, dispatch, subscribe };
};

// - Avoiding array mutation with concat(), slice(), and spread operator
//   - where [].push(someThing) mutates the original array,
//   [].concat(someThing) does not modify the original
//   - [...list, 0] also returns new array (spread operator)
//   - to remove item from array
//     - do not [].splice() as it modifies the original array
//     - [].slice(beginIdx, endIdx) does not mutates
    const list = [];
    return list
      .slice(0, idx)
      .concat(list.slice(idx + 1))
    // - with spread operator
      return [...list.slice(0, idx), ...list.slice(idx + 1)]
  // - to update item in an array
  //   - do not mutate the array
  //     - arr[idx] = newVal
    const list = [];
    return list
      .slice(0, idx)
      .concat([list[idx] + 1])
      .concat(list.slice(idx + 1))
    // - with spread operator
      return [
        ...list.slice(0, idx),
        list[idx] + 1,
        list.slice(idx + 1)
      ];
  // - Use deepFreeze in test to ensure that data is not mutating

// - Avoiding object mutation with Object.assign() and spread operator
//   - Object.assign() lets you assign properties of several objects onto target object
//     Object.assign({}, todo, {completed: false})
//   - If several object have the same property, the last one wins.  That val will be applied to new object
//   - spread operator does not require polyfil

// - Reducers are composable
  // - Different reducers describe how different parts of the state tree are updated in response to actions
  //   - reducers call call other reducers as they are regular JS functions

  // Top level reducer composition
    const todoApp = (state={}, action) => {
      return {
        todos: todos(state.todos, action),
        visibilityFilter: visibilityFilter(state.visibilityFilter, action),
      };
    };
    const { createStore } = Redux;
    const store =  createStore(todoApp);
    // Initial state of combined reducers now contains the initial state of the individual reducers

  // Reducer composition with combineReducers()
    // - generates top level reducer for you
    const { combineReducers } = Redux;
    const todoApp = combineReducers({
      todos: todos,
      visibilityFilter: visibilityFilter,
    });

    // keys of the object passed to combineReducers correspond to field of state objects to manage
    // by convention, always name reducers after the state field they manage:
      const { combineReducers } = Redux;
      const todoApp = combineReducers({
        todos,
        visibilityFilter,
      });

  // Implementing combineReducders from Scratch
    const combineReducders = (reducers) => {
      return (state, action) => {
        Object.keys(reducers).reduce( // Array.reduce()
          (nextState, key) => {
            nextState[key] = reducers[key](
              state[key],
              action);
            return nextState;
          },
          {} // Empty object for initial nextState before all keys are processed
        );
      }
    }

// Subscribe CONTAINER components to the store in componentDidMount
  // - Unsubscribe in componentWillUnmount
    componentDidMount() {
      this.unsubscribe = store.subscribe(() => this.forceUpdate())
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

// CONTAINER components are similar in that they connect
// a presentational component to the redux store and specifiy the data and behavior that it needs

// Passing store down explicitly as props

const TodoApp = ({ store }) => (
  <div>
    <AddTodo store={store} />
    <VisibleTodoList store={store} />
    <Footer store={store} />
  </div>);

const { createStore } = Redux;
ReactDOM.render(
  <TodoApp store={createStore(todoApp)} />,
  document.getElementById('root'));
  
  // Pass store to the container components

// Passing the Store Down Implicitly via Context
  class Provider extends Component {
    getChildContext() {
      return {
        store: this.props.store,
      };
    }

    render() {
      return this.props.children;
    }
  }
  // Must define childContextTypes
  // if you do not, no child component will recieve this context
  Provider.childContextTypes = {
    store: Proptype.object,
  }


  const TodoApp = ({ store }) => (
    <div>
      <AddTodo store={store} />
      <VisibleTodoList store={store} />
      <Footer store={store} />
    </div>);

  const { createStore } = Redux;
  ReactDOM.render(
    // Provider puts the store on context and makes it avail to children/grandchildren
    <Provider store={createStore(todoApp)}>
      <TodoApp />
    </Provider>,
    document.getElementById('root'));


  // Update the container components to read the store fron context instead of props
  // Each component must OPT IN to using context by:
    VisibleTodoList.contextTypes = {
      store: Proptype.object
    }

  // Context with functional components
    // Functional components recieve the context as a second arg
    const AddTodo = (props, context) => {}
    AddTodo.contextTypes = {
      store: Proptype.object
    }

// Passing the Store Down with <Provider> from React Redux
  // The <Provider /> component is included in the 'react-redux' library
    // - react bindings to the redux lib


// Generating Containers with connect() from React Redux (VisibleTodoList)
  const mapStateToProps = (state) => {
    return {
      todos: getVisibleTodos(state.todos, state.visibilityFilter)
    };
  };

  const mapDispatchToProps = (dispatch) => {
    return {
      onTodoClick: (id) => {return dispatch({ type: 'TOGGLE_TODO', id })},
    };
  };

  const { connect } = ReactRedux;
  const VisibleTodoList = connect(
    mapStateToProps,
    mapDispatchToProps
  )(TodoList);

// Generating Containers with connect() from React Redux (AddTodo)
  AddTodo = connect()(AddTodo);
    // If null passed as first arg to connect, the component is not subscribed to the store
    // If null passed as second arg to connect, the dispatch function is passed as props

// Generating Containers with connect() from React Redux (FooterLink)
  // mapStateToProps takes a second arg of props (the container components own props)
  const mapStateToProps = (state, props) => {
    return {
      active: state.visibilityFilter === props.filter,
    };
  };

// Extracting Action Creators
  // takes arguements about the action and returns the action object with type and additional info
  // Action creators are good for documenting software
    // What kinds of actions components can dispatch