---
title: More on Functions
layout: docs
permalink: /docs/handbook/2/functions.html
oneline: 'Learn about how Functions work in TypeScript.'
---

Functions are the basic building block of any application, whether they're local functions, imported from another module, or methods on a class.
They're also values, and just like other values, TypeScript has many ways to describe how functions can be called.
Let's learn about how to write types that describe functions.
函数是任何应用程序的基本构建块，无论它们是从另一个模块导入的本地函数，还是类上的方法。它们也是值，就像其他值一样，TypeScript 有许多方法来描述函数的调用方式。让我们学习如何编写描述函数的类型。

## Function Type Expressions 函数类型表达式

The simplest way to describe a function is with a _function type expression_.
These types are syntactically similar to arrow functions:
描述函数最简单的方法是使用函数类型表达式。这些类型在语法上类似于箭头函数:

```ts twoslash
function greeter(fn: (a: string) => void) {
  fn('Hello, World');
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole);
```

The syntax `(a: string) => void` means "a function with one parameter, named `a`, of type string, that doesn't have a return value".
Just like with function declarations, if a parameter type isn't specified, it's implicitly `any`.
语法`(a: string) => void` 表示“具有一个类型为 string 的参数(名为 `a`)的函数，该函数没有返回值”。就像函数声明一样，如果没有指定参数类型，它就是隐式的`any`。

> Note that the parameter name is **required**. The function type `(string) => void` means "a function with a parameter named `string` of type `any`"!
> 请注意，参数名是必需的。函数类型`(string) => void` 表示“一个具有类型为 any 的参数 名为 string 的函数”！

Of course, we can use a type alias to name a function type:
当然，我们可以使用类型别名来命名函数类型:

```ts twoslash
type GreetFunction = (a: string) => void;
function greeter(fn: GreetFunction) {
  // ...
}
```

## Call Signatures 调用签名

In JavaScript, functions can have properties in addition to being callable.
However, the function type expression syntax doesn't allow for declaring properties.
If we want to describe something callable with properties, we can write a _call signature_ in an object type:
在 JavaScript 中，函数除了可调用之外，还可以具有属性。但是，函数类型表达式语法不允许声明属性。如果我们想用属性来描述可调用的东西，我们可以在对象类型中写一个调用签名:

```ts twoslash
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};
function doSomething(fn: DescribableFunction) {
  console.log(fn.description + ' returned ' + fn(6));
}
```

Note that the syntax is slightly different compared to a function type expression - use `:` between the parameter list and the return type rather than `=>`.
注意，与函数类型表达式使用`:` 在参数列表和返回类型之间的语法稍有不同，而不是 `=>`。

## Construct Signatures 构造函数签名

JavaScript functions can also be invoked with the `new` operator.
TypeScript refers to these as _constructors_ because they usually create a new object.
You can write a _construct signature_ by adding the `new` keyword in front of a call signature:
函数也可以用新的操作符来调用。引用这些作为构造函数，因为它们通常会创建一个新对象。你可以通过在调用签名前面添加 new 关键字来写一个构造签名:

```ts twoslash
type SomeObject = any;
// ---cut---
type SomeConstructor = {
  new (s: string): SomeObject;
};
function fn(ctor: SomeConstructor) {
  return new ctor('hello');
}
```

Some objects, like JavaScript's `Date` object, can be called with or without `new`.
You can combine call and construct signatures in the same type arbitrarily:
有些对象，比如 JavaScript 的 Date 对象，可以使用或不使用 new 来调用。您可以任意组合调用和构造同一类型的签名:

```ts twoslash
interface CallOrConstruct {
  new (s: string): Date;
  (n?: number): number;
}
```

## Generic Functions 通用函数

It's common to write a function where the types of the input relate to the type of the output, or where the types of two inputs are related in some way.
Let's consider for a moment a function that returns the first element of an array:
通常编写一个函数，其中输入的类型与输出的类型相关，或者两个输入的类型以某种方式相关。让我们暂时考虑一个返回数组第一个元素的函数:

```ts twoslash
function firstElement(arr: any[]) {
  return arr[0];
}
```

This function does its job, but unfortunately has the return type `any`.
It'd be better if the function returned the type of the array element.
这个函数完成它的工作，但不幸的是返回类型为 any。如果函数返回数组元素的类型会更好。

In TypeScript, _generics_ are used when we want to describe a correspondence between two values.
We do this by declaring a _type parameter_ in the function signature:
在 TypeScript 中，当我们想要描述两个值之间的对应关系时，使用泛型。我们通过在函数签名中声明一个类型参数来实现:

```ts twoslash
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
```

By adding a type parameter `Type` to this function and using it in two places, we've created a link between the input of the function (the array) and the output (the return value).
Now when we call it, a more specific type comes out:
通过向这个函数添加类型参数 Type 并在两个地方使用它，我们在函数的输入(数组)和输出(返回值)之间创建了一个链接。现在，当我们调用它的时候，一个更具体的类型出现了:

```ts twoslash
declare function firstElement<Type>(arr: Type[]): Type | undefined;
// ---cut---
// s is of type 'string'
const s = firstElement(['a', 'b', 'c']);
// n is of type 'number'
const n = firstElement([1, 2, 3]);
// u is of type undefined
const u = firstElement([]);
```

### Inference 推断

Note that we didn't have to specify `Type` in this sample.
The type was _inferred_ - chosen automatically - by TypeScript.
注意，我们不必在这个示例中指定 `Type`。类型是由 TypeScript 自动推断选择的。

We can use multiple type parameters as well.
For example, a standalone version of `map` would look like this:
我们也可以使用多个类型参数，例如，一个独立版本的 map 看起来像这样:

```ts twoslash
// prettier-ignore
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
  return arr.map(func);
}

// Parameter 'n' is of type 'string'
// 'parsed' is of type 'number[]'
const parsed = map(['1', '2', '3'], (n) => parseInt(n));
```

Note that in this example, TypeScript could infer both the type of the `Input` type parameter (from the given `string` array), as well as the `Output` type parameter based on the return value of the function expression (`number`).
注意，在这个示例中，TypeScript 可以根据函数表达式的返回值(数字)推断出 Input 类型参数的类型(来自给定的字符串数组) ，以及 Output 类型参数。

### Constraints 约束

We've written some generic functions that can work on _any_ kind of value.
Sometimes we want to relate two values, but can only operate on a certain subset of values.
In this case, we can use a _constraint_ to limit the kinds of types that a type parameter can accept.
我们已经编写了一些通用函数，它们可以处理任何类型的值。有时候，我们希望关联两个值，但是只能对值的某个子集进行操作。在这种情况下，我们可以使用约束来限制类型参数可以接受的类型种类。

Let's write a function that returns the longer of two values.
To do this, we need a `length` property that's a number.
We _constrain_ the type parameter to that type by writing an `extends` clause:
让我们编写一个函数，返回两个值中较长的一个。要做到这一点，我们需要一个长度属性，它是一个数字。我们通过写一个 extends 子句将类型参数约束为该类型:

```ts twoslash
// @errors: 2345 2322
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}

// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
const longerString = longest('alice', 'bob');
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);
```

There are few interesting things to note in this example.
We allowed TypeScript to _infer_ the return type of `longest`.
Return type inference also works on generic functions.
在这个例子中几乎没有什么有趣的东西值得注意。我们允许打字稿推断出最长的返回类型。返回类型推断也适用于泛型函数。

Because we constrained `Type` to `{ length: number }`, we were allowed to access the `.length` property of the `a` and `b` parameters.
Without the type constraint, we wouldn't be able to access those properties because the values might have been some other type without a length property.
因为我们将 Type 限制为{ length: number } ，所以允许访问。A 和 b 参数的长度特性。如果没有类型约束，我们将无法访问这些属性，因为这些值可能是没有长度属性的其他类型。

The types of `longerArray` and `longerString` were inferred based on the arguments.
Remember, generics are all about relating two or more values with the same type!
根据参数推断出 longerArray 和 longerString 的类型。记住，泛型都是关于用同一类型关联两个或多个值的！

Finally, just as we'd like, the call to `longest(10, 100)` is rejected because the `number` type doesn't have a `.length` property.
最后，正如我们所希望的，对 `longest(10, 100)`的调用被拒绝，因为`number`类型没有`.length`特性。

### Working with Constrained Values 使用约束值

Here's a common error when working with generic constraints:
下面是处理一般约束时的一个常见错误:

```ts twoslash
// @errors: 2322
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj;
  } else {
    return { length: minimum };
  }
}
```

It might look like this function is OK - `Type` is constrained to `{ length: number }`, and the function either returns `Type` or a value matching that constraint.
The problem is that the function promises to return the _same_ kind of object as was passed in, not just _some_ object matching the constraint.
If this code were legal, you could write code that definitely wouldn't work:
这个函数可能看起来是可行的-`Type` 被限制为`{ length: number }` ，并且函数返回 `Type` 或匹配该限制的值。问题在于，该函数要求返回与传入的对象类型相同的对象，而不仅仅是匹配约束的对象。如果这些代码是合法的，你可以编写一些肯定不能工作的代码:

```ts twoslash
declare function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type;
// ---cut---
// 'arr' gets value { length: 6 }
const arr = minimumLength([1, 2, 3], 6);
// and crashes here because arrays have
// a 'slice' method, but not the returned object!
console.log(arr.slice(0));
```

### Specifying Type Arguments 指定类型参数

TypeScript can usually infer the intended type arguments in a generic call, but not always.
For example, let's say you wrote a function to combine two arrays:
通常可以在泛型调用中推断预期的类型参数，但并不总是如此。例如，假设你写了一个函数来组合两个数组:

```ts twoslash
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}
```

Normally it would be an error to call this function with mismatched arrays:
通常用不匹配的数组调用这个函数是错误的:

```ts twoslash
// @errors: 2322
declare function combine<Type>(arr1: Type[], arr2: Type[]): Type[];
// ---cut---
const arr = combine([1, 2, 3], ['hello']);
```

If you intended to do this, however, you could manually specify `Type`:
但是，如果你打算这么做，你可以手动指定 `Type`:

```ts twoslash
declare function combine<Type>(arr1: Type[], arr2: Type[]): Type[];
// ---cut---
const arr = combine<string | number>([1, 2, 3], ['hello']);
```

### Guidelines for Writing Good Generic Functions 编写良好通用函数的指南

Writing generic functions is fun, and it can be easy to get carried away with type parameters.
Having too many type parameters or using constraints where they aren't needed can make inference less successful, frustrating callers of your function.
编写泛型函数很有趣，而且很容易被类型参数冲昏头脑。拥有太多的类型参数，或者在不需要它们的地方使用约束，可能会导致推理不太成功，使函数调用者感到沮丧。

#### Push Type Parameters Down 下推类型参数

Here are two ways of writing a function that appear similar:
这里有两种编写类似函数的方法:

```ts twoslash
function firstElement1<Type>(arr: Type[]) {
  return arr[0];
}

function firstElement2<Type extends any[]>(arr: Type) {
  return arr[0];
}

// a: number (good)
const a = firstElement1([1, 2, 3]);
// b: any (bad)
const b = firstElement2([1, 2, 3]);
```

These might seem identical at first glance, but `firstElement1` is a much better way to write this function.
Its inferred return type is `Type`, but `firstElement2`'s inferred return type is `any` because TypeScript has to resolve the `arr[0]` expression using the constraint type, rather than "waiting" to resolve the element during a call.
乍一看，这两个函数似乎完全相同，但 `firstElement1`是编写这个函数的更好方法。它的推断返回类型是 `Type`，但 firstelement2 的推断返回类型是 any，因为 TypeScript 必须使用约束类型解析`arr[0]`表达式，而不是在调用期间“等待”解析元素。

> **Rule**: When possible, use the type parameter itself rather than constraining it
> 规则: 如果可能的话，使用类型参数本身而不是约束它

#### Use Fewer Type Parameters 使用更少的类型参数

Here's another pair of similar functions:

```ts twoslash
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func);
}

function filter2<Type, Func extends (arg: Type) => boolean>(
  arr: Type[],
  func: Func
): Type[] {
  return arr.filter(func);
}
```

We've created a type parameter `Func` that _doesn't relate two values_.
That's always a red flag, because it means callers wanting to specify type arguments have to manually specify an extra type argument for no reason.
`Func` doesn't do anything but make the function harder to read and reason about!
我们创建了一个类型参数 Func，它不关联两个值。这总是一个危险信号，因为这意味着调用者想要指定类型参数，就必须无缘无故地手动指定一个额外的类型参数。Func 什么都不做，只是让函数更难阅读和推理！

> **Rule**: Always use as few type parameters as possible
> 规则: 总是使用尽可能少的类型参数

#### Type Parameters Should Appear Twice 类型参数应该出现两次

Sometimes we forget that a function might not need to be generic:
有时候我们忘记了一个函数可能不需要是通用的:

```ts twoslash
function greet<Str extends string>(s: Str) {
  console.log('Hello, ' + s);
}

greet('world');
```

We could just as easily have written a simpler version:
我们也可以很容易地写出一个更简单的版本:

```ts twoslash
function greet(s: string) {
  console.log('Hello, ' + s);
}
```

Remember, type parameters are for _relating the types of multiple values_.
If a type parameter is only used once in the function signature, it's not relating anything.
请记住，类型参数用于关联多个值的类型。如果类型参数在函数签名中只使用一次，那么它不关联任何东西。

> **Rule**: If a type parameter only appears in one location, strongly reconsider if you actually need it
> 规则: 如果一个类型参数只出现在一个位置，请强烈重新考虑是否实际需要它

## Optional Parameters 可选参数

Functions in JavaScript often take a variable number of arguments.
For example, the `toFixed` method of `number` takes an optional digit count:
函数通常带有可变数量的参数。例如，toFixed 的数字方法有一个可选的数字计数:

```ts twoslash
function f(n: number) {
  console.log(n.toFixed()); // 0 arguments
  console.log(n.toFixed(3)); // 1 argument
}
```

We can model this in TypeScript by marking the parameter as _optional_ with `?`:
我们可以在 TypeScript 中通过将参数标记为可选的? :

```ts twoslash
function f(x?: number) {
  // ...
}
f(); // OK
f(10); // OK
```

Although the parameter is specified as type `number`, the `x` parameter will actually have the type `number | undefined` because unspecified parameters in JavaScript get the value `undefined`.
尽管该参数被指定为 type number，但是 x 参数实际上具有类型 number | undefined，因为 JavaScript 中未指定的参数获取未定义的值。

You can also provide a parameter _default_:
你也可以提供一个参数默认值:

```ts twoslash
function f(x = 10) {
  // ...
}
```

Now in the body of `f`, `x` will have type `number` because any `undefined` argument will be replaced with `10`.
Note that when a parameter is optional, callers can always pass `undefined`, as this simply simulates a "missing" argument:
现在在 f 的主体中，x 的类型为 number，因为任何未定义的参数都将被替换为 10。请注意，当一个参数是可选的时候，调用方总是可以传递未定义的参数，因为这只是模拟了一个“缺少的”参数:

```ts twoslash
declare function f(x?: number): void;
// cut
// All OK
f();
f(10);
f(undefined);
```

### Optional Parameters in Callbacks 回调函数中的可选参数

Once you've learned about optional parameters and function type expressions, it's very easy to make the following mistakes when writing functions that invoke callbacks:
一旦你了解了可选参数和函数类型表达式，在编写调用回调函数时很容易出现以下错误:

```ts twoslash
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}
```

What people usually intend when writing `index?` as an optional parameter is that they want both of these calls to be legal:
人们通常打算什么时候将`index`作为一个可选参数，以至于他们可以一起合法调用



```ts twoslash
// @errors: 2532
declare function myForEach(
  arr: any[],
  callback: (arg: any, index?: number) => void
): void;
// ---cut---
myForEach([1, 2, 3], (a) => console.log(a));
myForEach([1, 2, 3], (a, i) => console.log(a, i));
```

What this _actually_ means is that _`callback` might get invoked with one argument_.
In other words, the function definition says that the implementation might look like this:

这实际上意味着回调可以用一个参数调用。换句话说，函数定义表明实现可能是这样的:



```ts twoslash
// @errors: 2532
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    // I don't feel like providing the index today
    callback(arr[i]);
  }
}
```

In turn, TypeScript will enforce this meaning and issue errors that aren't really possible:
反过来，TypeScript会强化这种意义，并发出不太可能出现的错误:



<!-- prettier-ignore -->
```ts twoslash
// @errors: 2532
declare function myForEach(
  arr: any[],
  callback: (arg: any, index?: number) => void
): void;
// ---cut---
myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed());
});
```

In JavaScript, if you call a function with more arguments than there are parameters, the extra arguments are simply ignored.
TypeScript behaves the same way.
Functions with fewer parameters (of the same types) can always take the place of functions with more parameters.
在 JavaScript 中，如果调用一个比原有参数多的函数，额外的参数就会被忽略。TypeScript的行为也是这样的。具有较少参数的函数(具有相同的类型)总是可以取代具有较多参数的函数。



> When writing a function type for a callback, _never_ write an optional parameter unless you intend to _call_ the function without passing that argument
>当把回调函数当做类型的时候，永远不要编写可选参数，除非您想在不传递该参数的情况下调用该函数



## Function Overloads 函数的重载

Some JavaScript functions can be called in a variety of argument counts and types.
For example, you might write a function to produce a `Date` that takes either a timestamp (one argument) or a month/day/year specification (three arguments).
一些 JavaScript 函数可以通过各种参数计数和类型来调用。例如，您可以编写一个函数来生成一个接受时间戳(一个参数)或月/日/年规范(三个参数)的 Date。

In TypeScript, we can specify a function that can be called in different ways by writing _overload signatures_.
To do this, write some number of function signatures (usually two or more), followed by the body of the function:
在TypeScript中，我们可以通过写重载签名来定义一个可以以不同方式调用的函数。要做到这一点，写一些函数签名(通常是两个或更多) ，后面跟着函数体:

```ts twoslash
// @errors: 2575
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3);
```

In this example, we wrote two overloads: one accepting one argument, and another accepting three arguments.
These first two signatures are called the _overload signatures_.
在这个例子中，我们写了两个重载: 一个接受一个参数，另一个接受三个参数。前两个签名称为重载签名。

Then, we wrote a function implementation with a compatible signature.
Functions have an _implementation_ signature, but this signature can't be called directly.
Even though we wrote a function with two optional parameters after the required one, it can't be called with two parameters!
然后，我们编写了一个具有兼容签名的函数实现。函数有一个实现签名，但这个签名不能直接调用。即使我们在必需的参数之后写了一个带有两个可选参数的函数，它也不能用两个参数来调用！

### Overload Signatures and the Implementation Signature重载签名和实现签名

This is a common source of confusion.
Often people will write code like this and not understand why there is an error:
这是一个常见的困惑来源。通常人们写这样的代码并不理解为什么会有错误:


```ts twoslash
// @errors: 2554
function fn(x: string): void;
function fn() {
  // ...
}
// Expected to be able to call with zero arguments
fn();
```

Again, the signature used to write the function body can't be "seen" from the outside.
同样，用于写函数体的签名不能从外部“看到”。



> The signature of the _implementation_ is not visible from the outside.
> When writing an overloaded function, you should always have _two_ or more signatures above the implementation of the function.
>从外部看不到实现的签名。在编写重载函数时，应该始终在函数的实现上方有两个或多个签名。

The implementation signature must also be _compatible_ with the overload signatures.
For example, these functions have errors because the implementation signature doesn't match the overloads in a correct way:
实现签名还必须与重载签名兼容。例如，这些函数有错误，因为实现签名与重载不匹配:

```ts twoslash
// @errors: 2394
function fn(x: boolean): void;
// Argument type isn't right
function fn(x: string): void;
function fn(x: boolean) {}
```

```ts twoslash
// @errors: 2394
function fn(x: string): string;
// Return type isn't right
function fn(x: number): boolean;
function fn(x: string | number) {
  return 'oops';
}
```

### Writing Good Overloads

Like generics, there are a few guidelines you should follow when using function overloads.
Following these principles will make your function easier to call, easier to understand, and easier to implement.
与泛型一样，在使用函数重载时也应该遵循一些准则。遵循这些原则将使您的函数更容易调用、更容易理解和更容易实现。

Let's consider a function that returns the length of a string or an array:
让我们考虑一个返回字符串或数组长度的函数:

```ts twoslash
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) {
  return x.length;
}
```

This function is fine; we can invoke it with strings or arrays.
However, we can't invoke it with a value that might be a string _or_ an array, because TypeScript can only resolve a function call to a single overload:
这个函数很好; 我们可以用字符串或数组调用它。但是，我们不能用一个类型可能是字符串或数组的值来调用它，因为 TypeScript 只能将一个重载函数解析为函数来调用:



```ts twoslash
// @errors: 2769
declare function len(s: string): number;
declare function len(arr: any[]): number;
// ---cut---
len(''); // OK
len([0]); // OK
len(Math.random() > 0.5 ? 'hello' : [0]);
```

Because both overloads have the same argument count and same return type, we can instead write a non-overloaded version of the function:
因为两个重载有相同的参数计数和相同的返回类型，我们可以改写一个非重载版本的函数:



```ts twoslash
function len(x: any[] | string) {
  return x.length;
}
```

This is much better!
Callers can invoke this with either sort of value, and as an added bonus, we don't have to figure out a correct implementation signature.
这样好多了！调用方可以使用任意顺序的值来调用这个函数，作为额外的好处，我们不需要找出正确的实现签名。

> Always prefer parameters with union types instead of overloads when possible
>如果可能的话，总是倾向于使用联合类型的参数，而不是重载

### Declaring `this` in a Function 在函数中声明`this`

TypeScript will infer what the `this` should be in a function via code flow analysis, for example in the following:
TypeScript将通过代码流分析推断函数中的`this`应该是什么，例如:



```ts twoslash
const user = {
  id: 123,

  admin: false,
  becomeAdmin: function () {
    this.admin = true;
  },
};
```

TypeScript understands that the function `user.becomeAdmin` has a corresponding `this` which is the outer object `user`. `this`, _heh_, can be enough for a lot of cases, but there are a lot of cases where you need more control over what object `this` represents. The JavaScript specification states that you cannot have a parameter called `this`, and so TypeScript uses that syntax space to let you declare the type for `this` in the function body.
TypeScript明白函数 `user.becomeAdmin`有个this等价于 有一个外部对象`user`.`this`。这对很多情况来说都足够了，但是在很多情况下，你需要更多地控制它代表的物体。JavaScript 规范规定不能有一个名为 `this` 的参数，因此 TypeScript 使用这个语法空间来让您在函数体中声明这个参数的类型。



```ts twoslash
interface User {
  id: number;
  admin: boolean;
}
declare const getDB: () => DB;
// ---cut---
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();
const admins = db.filterUsers(function (this: User) {
  return this.admin;
});
```

This pattern is common with callback-style APIs, where another object typically controls when your function is called. Note that you need to use `function` and not arrow functions to get this behavior:
这种模式在回调样式的 api 中很常见，其中另一个对象通常控制调用函数的时间。注意，你需要使用函数而不是箭头函数来获得这个行为:

```ts twoslash
// @errors: 7041 7017
interface User {
  id: number;
  isAdmin: boolean;
}
declare const getDB: () => DB;
// ---cut---
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();
const admins = db.filterUsers(() => this.admin);
```

## Other Types to Know About 其他需要了解的类型

There are some additional types you'll want to recognize that appear often when working with function types.
Like all types, you can use them everywhere, but these are especially relevant in the context of functions.
在使用函数类型时，有一些额外的类型会经常出现，您需要识别它们。像所有类型一样，您可以在任何地方使用它们，但是这些类型在函数的上下文中特别相关。



### `void`

`void` represents the return value of functions which don't return a value.
It's the inferred type any time a function doesn't have any `return` statements, or doesn't return any explicit value from those return statements:
`void` 表示不返回值的函数的返回值。它将被推断出来的类型，当函数没有返回语句，或者返回语句没有返回任何明确的值时

```ts twoslash
// The inferred return type is void
function noop() {
  return;
}
```

In JavaScript, a function that doesn't return any value will implicitly return the value `undefined`.
However, `void` and `undefined` are not the same thing in TypeScript.
There are further details at the end of this chapter.
在 JavaScript 中，不返回任何值的函数将隐式返回`undefined`.。然而，`void`和 undefined 在TypeScript中并不是一回事。本章最后还有更多的细节。



> `void` is not the same as `undefined`.
> `void`不等于`undefined`.。

### `object`

The special type `object` refers to any value that isn't a primitive (`string`, `number`, `bigint`, `boolean`, `symbol`, `null`, or `undefined`).
This is different from the _empty object type_ `{ }`, and also different from the global type `Object`.
It's very likely you will never use `Object`.
特殊类型对象指的是任何不属于原始类型的值(string、 number、 bigint、 boolean、 symbol、 null 或 undefined)。这不同于空对象类型{} ，也不同于全局类型 Object。很有可能你永远不会使用 Object。

> `object` is not `Object`. **Always** use `object`!
>`object`不是`Object`。**始终**使用`object`！

Note that in JavaScript, function values are objects: They have properties, have `Object.prototype` in their prototype chain, are `instanceof Object`, you can call `Object.keys` on them, and so on.
For this reason, function types are considered to be `object`s in TypeScript.
注意，在 JavaScript 中，函数值是对象: 它们具有属性，在原型链中具有 Object.prototype，是 instanceof Object，可以在它们上面调用 Object.keys，等等。由于这个原因，函数类型在TypeScript中被认为是对象。

### `unknown`

The `unknown` type represents _any_ value.
This is similar to the `any` type, but is safer because it's not legal to do anything with an `unknown` value:
未知类型表示任何值。这和任何类型都类似，但是更安全，因为使用未知值是不合法的:



```ts twoslash
// @errors: 2571
function f1(a: any) {
  a.b(); // OK
}
function f2(a: unknown) {
  a.b();
}
```

This is useful when describing function types because you can describe functions that accept any value without having `any` values in your function body.
这在描述函数类型时非常有用，因为您可以描述接受任何值的函数，而函数体中没有`any` 值。



Conversely, you can describe a function that returns a value of unknown type:
相反，你可以描述一个返回未知类型值的函数:

```ts twoslash
declare const someRandomString: string;
// ---cut---
function safeParse(s: string): unknown {
  return JSON.parse(s);
}

// Need to be careful with 'obj'!
const obj = safeParse(someRandomString);
```

### `never`

Some functions _never_ return a value:
有些函数从不返回值:



```ts twoslash
function fail(msg: string): never {
  throw new Error(msg);
}
```

The `never` type represents values which are _never_ observed.
In a return type, this means that the function throws an exception or terminates execution of the program.
Never 类型表示从未观察到的值。在返回类型中，这意味着函数抛出异常或终止程序的执行。



`never` also appears when TypeScript determines there's nothing left in a union.
当TypeScript没有剩余的类型时，`never` 也会出现 。



```ts twoslash
function fn(x: string | number) {
  if (typeof x === 'string') {
    // do something
  } else if (typeof x === 'number') {
    // do something else
  } else {
    x; // has type 'never'!
  }
}
```

### `Function`

The global type `Function` describes properties like `bind`, `call`, `apply`, and others present on all function values in JavaScript.
It also has the special property that values of type `Function` can always be called; these calls return `any`:
全局类型 Function 描述了类似 bind、 call、 apply 等属性，这些属性出现在 JavaScript 中的所有函数值上。它还有一个特殊属性，即 Function 类型的值总是可以被调用; 这些调用返回`any`:






```ts twoslash
function doSomething(f: Function) {
  f(1, 2, 3);
}
```

This is an _untyped function call_ and is generally best avoided because of the unsafe `any` return type.
这是一个非类型化的函数调用，通常最好避免这种情况，因为`any`返回类型都是不安全的。

If you need to accept an arbitrary function but don't intend to call it, the type `() => void` is generally safer.
如果您需要接受一个任意函数，但不打算调用它，那么 type () = > void 通常更安全。



## Rest Parameters and Arguments 剩余参数和参数

<blockquote class='bg-reading'>
   <p>Background Reading:<br />
   <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters'>Rest Parameters</a><br/>
   <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax'>Spread Syntax</a><br/>
   </p>
</blockquote>

### Rest Parameters

In addition to using optional parameters or overloads to make functions that can accept a variety of fixed argument counts, we can also define functions that take an _unbounded_ number of arguments using _rest parameters_.
除了使用可选参数或重载使函数可以接受各种固定的参数计数，我们还可以定义使用 rest 参数接受无限个参数的函数。

A rest parameter appears after all other parameters, and uses the `...` syntax:
在所有其他参数之后会出现一个 rest 参数，它使用... 语法:

```ts twoslash
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}
// 'a' gets value [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);
```

In TypeScript, the type annotation on these parameters is implicitly `any[]` instead of `any`, and any type annotation given must be of the form `Array<T>`or `T[]`, or a tuple type (which we'll learn about later).
在 TypeScript 中，这些参数上的类型注释隐式地是 any []而不是 any，并且给出的任何类型注释都必须是 Array < t > 或 t []这样的形式，或者是一个 tuple 类型(我们将在后面学习)。



### Rest Arguments

Conversely, we can _provide_ a variable number of arguments from an array using the spread syntax.
For example, the `push` method of arrays takes any number of arguments:
相反，我们可以使用 spread 语法从数组中提供可变数量的参数。例如，数组的 push 方法接受任意数量的参数:



```ts twoslash
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
arr1.push(...arr2);
```

Note that in general, TypeScript does not assume that arrays are immutable.
This can lead to some surprising behavior:
注意，一般来说，TypeScript 并不假定数组是不可变的，这会导致一些令人惊讶的行为:



```ts twoslash
// @errors: 2556
// Inferred type is number[] -- "an array with zero or more numbers",
// not specifically two numbers
const args = [8, 5];
const angle = Math.atan2(...args);
```

The best fix for this situation depends a bit on your code, but in general a `const` context is the most straightforward solution:
对于这种情况，最好的解决办法有点取决于你的代码，但是一般来说，常量上下文是最直接的解决方案:



```ts twoslash
// Inferred as 2-length tuple
const args = [8, 5] as const;
// OK
const angle = Math.atan2(...args);
```

Using rest arguments may require turning on [`downlevelIteration`](/tsconfig#downlevelIteration) when targeting older runtimes.
使用 rest 参数可能需要在针对旧的运行时打开 downlevelIteration。



<!-- TODO link to downlevel iteration -->

## Parameter Destructuring

<blockquote class='bg-reading'>
   <p>Background Reading:<br />
   <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment'>Destructuring Assignment</a><br/>
   </p>
</blockquote>

You can use parameter destructuring to conveniently unpack objects provided as an argument into one or more local variables in the function body.
In JavaScript, it looks like this:
可以使用参数析构化来方便地将作为参数提供的对象解压缩到函数体中的一个或多个局部变量中。在 JavaScript 中，它是这样的:



```js
function sum({ a, b, c }) {
  console.log(a + b + c);
}
sum({ a: 10, b: 3, c: 9 });
```

The type annotation for the object goes after the destructuring syntax:
类型注释在解构语法之后



```ts twoslash
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}
```

This can look a bit verbose, but you can use a named type here as well:
这看起来有点冗长，但是你也可以在这里使用命名类型:



```ts twoslash
// Same as prior example
type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}
```

## Assignability of Functions

### Return type `void`

The `void` return type for functions can produce some unusual, but expected behavior.
函数的 void 返回类型可以产生一些不寻常但是预期的行为。



Contextual typing with a return type of `void` does **not** force functions to **not** return something. Another way to say this is a contextual function type with a `void` return type (`type vf = () => void`), when implemented, can return _any_ other value, but it will be ignored.
返回类型为 void 的上下文类型不会强制函数不返回某些内容。另一种说法是，带有 void 返回类型(type vf = () = > void)的上下文函数类型在实现时可以返回任何其他值，但它将被忽略。



Thus, the following implementations of the type `() => void` are valid:
因此，type () = > void 的下列实现是有效的:



```ts twoslash
type voidFunc = () => void;

const f1: voidFunc = () => {
  return true;
};

const f2: voidFunc = () => true;

const f3: voidFunc = function () {
  return true;
};
```

And when the return value of one of these functions is assigned to another variable, it will retain the type of `void`:
当其中一个函数的返回值被赋给另一个变量时，它将保留 void 类型:



```ts twoslash
type voidFunc = () => void;

const f1: voidFunc = () => {
  return true;
};

const f2: voidFunc = () => true;

const f3: voidFunc = function () {
  return true;
};
// ---cut---
const v1 = f1();

const v2 = f2();

const v3 = f3();
```

This behavior exists so that the following code is valid even though `Array.prototype.push` returns a number and the `Array.prototype.forEach` method expects a function with a return type of `void`.

还有另外一个需要注意的特殊情况，当文本函数定义具有 void 返回类型时，该函数不能返回任何内容。



```ts twoslash
const src = [1, 2, 3];
const dst = [0];

src.forEach((el) => dst.push(el));
```

There is one other special case to be aware of, when a literal function definition has a `void` return type, that function must **not** return anything.
还有另外一个需要注意的特殊情况，当文本函数定义具有 void 返回类型时，该函数不能返回任何内容。

```ts twoslash
function f2(): void {
  // @ts-expect-error
  return true;
}

const f3 = function (): void {
  // @ts-expect-error
  return true;
};
```

For more on `void` please refer to these other documentation entries:
关于 void 的更多信息，请参考其他文档条目:



- [v1 handbook](https://www.typescriptlang.org/docs/handbook/basic-types.html#void)
- [v2 handbook](https://www.typescriptlang.org/docs/handbook/2/functions.html#void)
- [FAQ - "Why are functions returning non-void assignable to function returning void?"](https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-functions-returning-non-void-assignable-to-function-returning-void)
