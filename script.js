'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
const account5 = {
  owner: 'Afolabi Ola',
  movements: [430, 1000, 700, 50, 90, 200, 500000000000],
  interestRate: 50,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4 /*account5*/];
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovement = function (movements, sort = false) {
  containerMovements.innerHTML = ' ';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
     <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBal = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance}€`;
};

const calcDisplaySummary = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${income}€`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out)}€`;

  const intrest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${intrest}€`;
};

const createUsername = function (accts) {
  accts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);

const updateUI = function (account) {
  displayMovement(account.movements);
  calcDisplayBal(account);
  calcDisplaySummary(account);
};

const clearInput = function (input1, input2) {
  input1.value = '';
  input2.value = '';
  input1.blur('');
  input2.blur('');
};
//Implementing login
let currentAccount;

btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display Welcome
    //Display movements
    //Display balance
    //Display summary
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    clearInput(inputLoginUsername, inputLoginPin);
    inputLoginPin.blur('');
    updateUI(currentAccount);
  } else {
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Wrong Login Data`;
  }
});
/////Implementing Transfer
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  clearInput(inputTransferAmount, inputTransferTo);

  if (
    amount > 0 &&
    recieverAccount &&
    amount <= currentAccount.balance &&
    recieverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  /*
  // -----My transfer protocol----
  if (
    amount > 0 &&
    amount <= Number(labelBalance.textContent.replace('€', '')) &&
    inputTransferTo.value != currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);
    displayMovement(currentAccount.movements);
    calcDisplayBal(currentAccount.movements);
    calcDisplaySummary(currentAccount);
  }
*/
});

//Implementing Loan Request

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur('');
  /*
  //My loan protocol
  const loan = Number(inputLoanAmount.value);
  const loanPercent = (loan * 10) / 100;

  if (currentAccount.movements.some(mov => mov >= loanPercent)) {
    currentAccount.movements.push(loan);
    updateUI(currentAccount);
    inputLoanAmount.value = '';
    inputLoanAmount.blur('');
  }
  */
});

//Implementing Delete Account

btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    accounts.splice(index, 1);
  }
  containerApp.style.opacity = 0;
  clearInput(inputCloseUsername, inputClosePin);
});
let sortState = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();

  displayMovement(currentAccount.movements, !sortState);

  sortState = !sortState;
});

// console.log(createUsername('Steven Thomas Williams'));

// console.log(containerMovements.innerHTML);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*
let arr = ['a', 'b', 'c', 'd', 'e'];
// SLICE METHOD returns shallow copy of the original array
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice(2, -2));
console.log(arr.slice());
console.log(arr);

// SPLICE METHOD it mutatate the original array
arr.splice(-1);
console.log(arr);
arr.splice(1, 2); //this takes the second para as number of deleted items
console.log(arr);

const months=['jan','march','april','june']
console.log(months.splice(1,0,'feb'));
console.log(months.splice(4,1,'may'));
console.log(months);

REVERSE METHOD returns a revesrse of the original array and also mutatates the original array
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());

//CONCAT return two joined arrays
arr = ['a', 'b', 'c', 'd', 'e'];
const letters = arr.concat(arr2);
console.log(letters); //this can also be done as below:
console.log([...arr, ...arr2]);

//JOIN METHOD return the arr in a string format
console.log(letters.join(' - '));

//THE AT METHOD
const arr=[23,11,64]
console.log(arr[0]);
console.log(arr.at(0));

//GETTING THE LAST ELEMENT IN AN ARRAY
console.log(arr[arr.length-1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

console.log('jonas'.at(0));
console.log('jonas'.at(-1));

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [i,movement] of movements.entries()) {
  const data = movement > 0 ? 'deposited' : 'withdrew';
  console.log(`Movement ${i+1}: You ${data} ${Math.abs(movement)}`);
}

console.log('---FOR EACH---');

movements.forEach((movement,i,array) => {
   const data = movement > 0 ? 'deposited' : 'withdrew';
  console.log(`Movement ${i + 1}: You ${data} ${Math.abs(movement)}`);
})

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach((value, key, map) => {
  console.log(`${key}: ${value}`);
});

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach((value, _, set) => {
  console.log(`${value}: ${value}`);
});

*/

///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀*/
/*
const checkDogs = function (dogsJulia, dogsKate) {
  const newDogsJulia = dogsJulia.slice();
  newDogsJulia.splice(0, 1);
  newDogsJulia.splice(-2);
  const correctDogs = newDogsJulia.concat(dogsKate);
  console.log('-----My Solving----');
  correctDogs.forEach((dog, i) => {
    const ageRange = dog >= 3 ? 'is an Adult' : 'is still a Puppy 🐶';
    console.log(`Dog number ${i + 1} ${ageRange}, and is ${dog} years old`);
  });
  console.log(' ---Jonas Solving----');
  correctDogs.forEach((dog, i) => {
    if (dog >= 3) {
      console.log(`Dog number ${i + 1} is an Adult, and is ${dog} years old`);
    } else {
      console.log(`Dog number ${i + 1} is still a Puppy 🐶`);
    }
  });
};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
*/

//////////////////////////////////
//Map Method
/*
const eurTousd = 1.1;

const movementsUsd = movements.map(mov => mov * eurTousd);

console.log(movements);
console.log(movementsUsd);

const movementUsdFor = [];

for (const mov of movements) movementUsdFor.push(mov * eurTousd);

console.log(movementUsdFor);

//-----My Method -----
// const movementDesc = movements.map((mov, i) => {
//   const data = mov > 0 ? 'deposited' : 'withdrew';
//   return (`Movement ${i + 1}: You ${data} ${Math.abs(mov)}`);
// })

// console.log(movementDesc);

const movementDesc = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);
console.log(movementDesc);
*/

////////////////////
// ----Filter Method--------
/*
const deposits = movements.filter(mov => {
  return mov > 0;
});

console.log(movements);
console.log(deposits);

const depositsFor = [];
for (const mov of movements)
  if (mov > 0) {
    depositsFor.push(mov);
  }

console.log(movements);
console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);
*/

// console.log(movements);

/*
//acc is known as accumulator => Snowball
const balance = movements.reduce((acc, curr) => acc + curr, 0);
console.log(balance);
let balance2 = 0;
for (const mov of movements) {
  balance2 += mov;
}
console.log(balance2);

// Maximum Value

const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);
*/

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
/*  
const calcAverageHumanAge = function (ages) {
  console.log(ages);
  const humanAge = ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
     .reduce((acc, ages, i, arr) => acc + ages / arr.length, 0);
  return humanAge;
};
console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));
*/
/*
//------Magic Chaining Method-----
const eurTousd = 1.1;

const totalDepositsUsd = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurTousd)
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositsUsd);
*/

///////////////////////////////////////
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
/*
const calcAverageHumanAge = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(ages => ages >= 18)
    .reduce((acc, ages, i, arr) => acc + ages / arr.length, 0);

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));
*/
/*
// ---The Find Method-------

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

for (const account of accounts) {
  account.owner === 'Sarah Smith' ? console.log(account) : console.log('');
}
*/

/*
console.log(movements);

//For Equality
console.log(movements.includes(-130));

//Some Condition
console.log(movements.some(mov => mov === -130));

const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

//Every Condition

console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

//Seperate Callback
const deposit = mov => mov > 0

console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
*/
/*
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [[4, 5], 6], 7, 8];
console.log(arrDeep.flat(2));

//---The Flat Method-----
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

//---The FlatMap Method-----
const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);
*/
/*
//------The Sort Method-------

//Strings

const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);

//----Numbers------

console.log(movements);
// return < 0 A, B (keep order)
// return > 0 B, A (switch order)

// Ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });
// console.log(movements);
movements.sort((a, b) => a - b);
console.log(movements);

// Descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (b > a) return 1;
// });
movements.sort((a, b) => b - a);
console.log(movements);
*/
/*
//Array fill with .fill and .from
const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));
const x = new Array(7);
console.log(x);
// console.log(
//   x.map(() => {
//     5
//   })
// );
x.fill(1, 0, 3);
x.fill(5, 3);
console.log(x);

arr.fill('john', 2, 6);
console.log(arr);

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);
const diceRolls = Array.from({ length: 100 }, (_, i) =>
  Math.trunc(Math.random() * 6 + 1)
);
console.log(diceRolls);

labelBalance.addEventListener('click', () => {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});
*/

//Ex 1
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, cur) => acc + cur, 0);
console.log(bankDepositSum);

//Ex 2

// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

console.log(numDeposits1000);

//Prefixed ++ operator

let a = 10;
console.log(++a);
console.log(a);

//Ex 3

const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sum, cur) => {
      // cur > 0 ? (sum.deposits += cur) : (sum.withdrawals += cur);
      sum[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sum;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

//Ex 4
//this is a nice title => This Is a Nice Title
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exception = ['a', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exception.includes(word) ? word : capitalize(word)))
    .join(' ');

  return capitalize(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a long title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));

///////////////////////////////////////
// Coding Challenge #4

/*  
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/
//My solution
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(
  dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);

console.log(dogs);
//Jonas Solution is the same

// 2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
//My solution
const sarahDogObject = dogs.find(dog =>
  dog.owners.find(owner => owner === 'Sarah')
);
console.log(sarahDogObject);

if (
  sarahDogObject.curFood > sarahDogObject.recommendedFood * 0.9 &&
  sarahDogObject.curFood < sarahDogObject.recommendedFood * 1.1
) {
  console.log(`Sarah's dog is eating normal`);
} else if (sarahDogObject.curFood > sarahDogObject.recommendedFood * 1.1) {
  console.log(`Sarah's dog is eating too much`);
} else if (sarahDogObject.curFood < sarahDogObject.recommendedFood * 0.9) {
  console.log(`Sarah's dog is eating too little`);
}
// Jonas Solution
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
  `Sarah's dog is eating too ${
    dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'little'
  }`
);

// 3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
//My solution
const ownersEatTooMuch = dogs.map(dog => {
  if (dog.curFood > dog.recommendedFood * 1.1) {
    return dog.owners;
  } else {
    return;
  }
});
console.log(ownersEatTooMuch);
const ownersEatTooLittle = dogs.map(dog => {
  if (dog.curFood < dog.recommendedFood * 0.9) {
    return dog.owners;
  } else {
    return;
  }
});
console.log(ownersEatTooLittle);
//Jonas Solution
const ownersEatTooMuchFood = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuchFood);
const ownersEatTooLittleFood = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittleFood);
// 4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
//My solution
// ownersEatTooMuch.forEach(owner => {
console.log(`${ownersEatTooMuch.flat().join(' and ')}'s dogs eat too much`);
// });
console.log(`${ownersEatTooLittle.flat().join(' and ')}'s dogs eat too much`);
// ownersEatTooLittle.forEach(owner => {
//   // const [name] = owner;
//   // console.log(name);
//   console.log(`${owner.join(' and ')} dogs eats too little`);
//   // console.log(`${owner}'s dogs eat too much`);
//   // console.log();
// });

//Jonas Solution
console.log(`${ownersEatTooMuchFood.join(' and ')}'s dogs eat too much`);
console.log(`${ownersEatTooLittleFood.join(' and ')}'s dogs eat too little`);

// 5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
//My solution
dogs.forEach(dog => console.log(dog.curFood === dog.recommendedFood));
//Jonnas Solution
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));
// 6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
//My solution
dogs.forEach(dog =>
  console.log(
    dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1
  )
);
//Jonnas Solution
const checkEatingOkay = dog =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;
console.log(dogs.some(checkEatingOkay));
// 7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
//My solution
const dogsOkay = dogs.map(dog => {
  const nDog =
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1;
  return nDog;
});
console.log(dogsOkay);
// Jonas Solution
console.log(dogs.filter(checkEatingOkay));
// 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)
//Jonas Solutuion
const dogsSorted = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogsSorted);
