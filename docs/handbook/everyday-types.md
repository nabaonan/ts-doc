---
title: Everyday Types
layout: docs
permalink: /docs/handbook/2/everyday-types.html
oneline: 'The language primitives.'
---

In this chapter, we'll cover some of the most common types of values you'll find in JavaScript code, and explain the corresponding ways to describe those types in TypeScript.
This isn't an exhaustive list, and future chapters will describe more ways to name and use other types.
在本章中，我们将介绍一些在 JavaScript 代码中最常见的值类型，并解释在 TypeScript 中描述这些类型的相应方法。这并不是一个详尽的列表，以后的章节将描述更多命名和使用其他类型的方法。

Types can also appear in many more _places_ than just type annotations.
As we learn about the types themselves, we'll also learn about the places where we can refer to these types to form new constructs.
类型还可以出现在许多地方，而不仅仅是类型注释。当我们了解类型本身时，我们还将了解可以引用这些类型来形成新结构的位置。

We'll start by reviewing the most basic and common types you might encounter when writing JavaScript or TypeScript code.
我们将首先回顾一下在编写 JavaScript 或 TypeScript 代码时可能遇到的最基本和最常见的类型。

These will later form the core building blocks of more complex types.
这些将在以后形成更复杂类型的核心构建块。

## The primitives: `string`, `number`, and `boolean` 原始类型: `字符串`, `数字`, 和 `布尔`

JavaScript has three very commonly used [primitives](https://developer.mozilla.org/en-US/docs/Glossary/Primitive): `string`, `number`, and `boolean`.
Each has a corresponding type in TypeScript.
As you might expect, these are the same names you'd see if you used the JavaScript `typeof` operator on a value of those types:
javasript 有三种非常常用的原语: 字符串、数字和布尔值。每个都有一个相应的打字稿类型。正如你所期望的，如果你在这些类型的值上使用 JavaScript typeof 操作符，你会看到相同的名字:

- `string` represents string values like `"Hello, world"`

   `string` 表示字符串值，如 `"Hello, world"`

- `number` is for numbers like `42`. JavaScript does not have a special runtime value for integers, so there's no equivalent to `int` or `float` - everything is simply `number` `number` 

  就是数字，比如 `42`. JavaScript 没有一个特殊的整数运行时, 所以没有判断相等 `int` or `float` - 一切都是简单的 `number`

- `boolean` is for the two values `true` and `false` 

  `boolean` 比较两个值 `true` and `false`

> The type names `String`, `Number`, and `Boolean` (starting with capital letters) are legal, but refer to some special built-in types that will very rarely appear in your code. _Always_ use `string`, `number`, or `boolean` for types. 
>
> 类型名字 String、 Number 和 Boolean (以大写字母开头)是合法的，但是引用一些特殊的内置类型，这些类型很少出现在代码中。对于类型，总是使用字符串、数字或布尔值。

## 数组 Arrays

To specify the type of an array like `[1, 2, 3]`, you can use the syntax `number[]`; this syntax works for any type (e.g. `string[]` is an array of strings, and so on).
You may also see this written as `Array<number>`, which means the same thing.
We'll learn more about the syntax `T<U>` when we cover _generics_.
要指定类似[1,2,3]的数组类型，可以使用语法编号[] ; 这种语法适用于任何类型(例如 string []是字符串数组，等等)。你也可以看到它被写成 Array < number > ，这意味着同样的事情。当我们讨论泛型时，我们将学习更多关于语法 t < u > 的知识。

> 请注意，`[ number ]`是另一回事，请参阅有关 Tuples 的章节。[元祖](/docs/handbook/2/objects.html#tuple-types).

## `Any 任意类型`

TypeScript also has a special type, `any`, that you can use whenever you don't want a particular value to cause typechecking errors.
TypeScript 还有一个特殊类型，any，可以在不希望某个特定值导致类型检查错误时使用。

When a value is of type `any`, you can access any properties of it (which will in turn be of type `any`), call it like a function, assign it to (or from) a value of any type, or pretty much anything else that's syntactically legal:
当一个值的类型是 `any` 时，你可以访问它的任何属性(反过来也可以是 `any` 类型的属性) ，像调用函数一样调用它，将它赋给(或从)任何类型的值，或者几乎所有其他在语法上合法的属性:

```ts twoslash
let obj: any = { x: 0 };
// None of the following lines of code will throw compiler errors.
// Using `any` disables all further type checking, and it is assumed
// you know the environment better than TypeScript.
obj.foo();
obj();
obj.bar = 100;
obj = 'hello';
const n: number = obj;
```

The `any` type is useful when you don't want to write out a long type just to convince TypeScript that a particular line of code is okay.
当你不想仅仅为了让 TypeScript 相信某一行代码是可行的而写出一个长类型时，`any` 类型是很有用的。

### `noImplicitAny`

When you don't specify a type, and TypeScript can't infer it from context, the compiler will typically default to `any`.
当您没有指定类型，并且 TypeScript 不能从上下文推断出类型时，编译器通常会默认为`any`。

You usually want to avoid this, though, because `any` isn't type-checked.
Use the compiler flag [`noImplicitAny`](/tsconfig#noImplicitAny) to flag any implicit `any` as an error.
不过，您通常希望避免这种情况，因为没有对任何类型进行检查。使用编译器标记[`noImplicitAny`](/tsconfig#noImplicitAny) 将任何隐含的`any`标记为错误。

## Type Annotations on Variables 变量的类型注释

When you declare a variable using `const`, `var`, or `let`, you can optionally add a type annotation to explicitly specify the type of the variable:
使用 const、 var 或 let 声明变量时，可以选择添加类型注释以显式指定变量的类型:

```ts twoslash
let myName: string = 'Alice';
//        ^^^^^^^^ Type annotation
```

> TypeScript doesn't use "types on the left"-style declarations like `int x = 0;`
> Type annotations will always go _after_ the thing being typed.

In most cases, though, this isn't needed.
Wherever possible, TypeScript tries to automatically _infer_ the types in your code.
For example, the type of a variable is inferred based on the type of its initializer:
然而，在大多数情况下，这是不必要的。只要有可能，TypeScript 就会尝试自动推断代码中的类型。例如，变量的类型是基于其初始化器的类型来推断的:

```ts twoslash
// No type annotation needed -- 'myName' inferred as type 'string'
let myName = 'Alice';
```

For the most part you don't need to explicitly learn the rules of inference.
If you're starting out, try using fewer type annotations than you think - you might be surprised how few you need for TypeScript to fully understand what's going on.
在大多数情况下，您不需要明确地学习推理的规则。如果你刚开始使用，尝试使用比你想象的更少的类型注释——你可能会惊讶于你需要 TypeScript 来完全理解发生了什么。

## Functions 函数

Functions are the primary means of passing data around in JavaScript.
TypeScript allows you to specify the types of both the input and output values of functions.

函数是 JavaScript 中传递数据的主要方式。允许您指定函数的输入和输出值的类型。

### Parameter Type Annotations 参数类型注解

When you declare a function, you can add type annotations after each parameter to declare what types of parameters the function accepts.
Parameter type annotations go after the parameter name:

在声明函数时，可以在每个参数后面添加类型注释，以声明函数接受哪些类型的参数。

参数类型注解跟在参数名后面:

```ts twoslash
// Parameter type annotation
function greet(name: string) {
  //                 ^^^^^^^^
  console.log('Hello, ' + name.toUpperCase() + '!!');
}
```

When a parameter has a type annotation, arguments to that function will be checked:
当一个参数具有类型注释时，该函数的参数将被检查:

```ts twoslash
// @errors: 2345
declare function greet(name: string): void;
// ---cut---
// Would be a runtime error if executed!
greet(42);
```

> Even if you don't have type annotations on your parameters, TypeScript will still check that you passed the right number of arguments.即使您的参数上没有类型注释，TypeScript 仍然会检查您传递的参数数量是否正确。

### Return Type Annotations 返回类型注释

You can also add return type annotations.
Return type annotations appear after the parameter list:
你也可以添加返回类型注释，返回类型注释会出现在参数列表之后:

```ts twoslash
function getFavoriteNumber(): number {
  //                        ^^^^^^^^
  return 26;
}
```

Much like variable type annotations, you usually don't need a return type annotation because TypeScript will infer the function's return type based on its `return` statements.
The type annotation in the above example doesn't change anything.
Some codebases will explicitly specify a return type for documentation purposes, to prevent accidental changes, or just for personal preference.
很像变量类型注释，您通常不需要返回类型注释，因为 TypeScript 将根据函数的返回语句推断其返回类型。上面示例中的类型注释不会改变任何东西。有些代码库为了文档目的，为了防止意外的更改，或者仅仅为了个人喜好，会显式地指定返回类型。

### Anonymous Functions 匿名函数

Anonymous functions are a little bit different from function declarations.
When a function appears in a place where TypeScript can determine how it's going to be called, the parameters of that function are automatically given types.
匿名函数与函数声明稍有不同。当一个函数出现在可以决定如何调用它的地方时，该函数的参数将自动给定类型。

Here's an example:
下面是一个例子:

```ts twoslash
// @errors: 2551
// No type annotations here, but TypeScript can spot the bug
const names = ['Alice', 'Bob', 'Eve'];

// Contextual typing for function
names.forEach(function (s) {
  console.log(s.toUppercase());
});

// Contextual typing also applies to arrow functions
names.forEach((s) => {
  console.log(s.toUppercase());
});
```

Even though the parameter `s` didn't have a type annotation, TypeScript used the types of the `forEach` function, along with the inferred type of the array, to determine the type `s` will have.
尽管参数 s 没有类型注释，但 TypeScript 使用 forEach 函数的类型以及数组的推断类型来确定 s 将具有的类型。

This process is called _contextual typing_ because the _context_ that the function occurred within informs what type it should have.
这个过程称为上下文类型化，因为函数所处的上下文告诉它应该具有什么类型。

Similar to the inference rules, you don't need to explicitly learn how this happens, but understanding that it _does_ happen can help you notice when type annotations aren't needed.
Later, we'll see more examples of how the context that a value occurs in can affect its type.
与推理规则类似，您不需要明确地了解这种情况是如何发生的，但是了解它确实发生了可以帮助您注意到何时不需要类型注释。稍后，我们将看到更多示例，说明值出现的上下文如何影响其类型。

## Object Types 对象类型

Apart from primitives, the most common sort of type you'll encounter is an _object type_.
This refers to any JavaScript value with properties, which is almost all of them!
To define an object type, we simply list its properties and their types.
除了基本类型之外，最常见的类型是对象类型。这指的是任何带有属性的 JavaScript 值，这几乎是所有的属性！要定义对象类型，只需列出其属性及其类型。

For example, here's a function that takes a point-like object:
例如，这里有一个接受点状对象的函数:

```ts twoslash
// The parameter's type annotation is an object type
function printCoord(pt: { x: number; y: number }) {
  //                      ^^^^^^^^^^^^^^^^^^^^^^^^
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
```

Here, we annotated the parameter with a type with two properties - `x` and `y` - which are both of type `number`.
You can use `,` or `;` to separate the properties, and the last separator is optional either way.
在这里，我们用具有两个属性(x 和 y)的类型对参数进行了注释，这两个属性都是 number 类型。您可以使用，或; 来分隔属性，最后一个分隔符是可选的。

The type part of each property is also optional.
If you don't specify a type, it will be assumed to be `any`.
每个属性的类型部分也是可选的。如果没有指定类型，则假定它是任何类型。

### Optional Properties 可选属性

Object types can also specify that some or all of their properties are _optional_.
To do this, add a `?` after the property name:
对象类型还可以指定其部分或全部属性是可选的。要做到这一点，添加一个？在属性名称后面:

```ts twoslash
function printName(obj: { first: string; last?: string }) {
  // ...
}
// Both OK
printName({ first: 'Bob' });
printName({ first: 'Alice', last: 'Alisson' });
```

In JavaScript, if you access a property that doesn't exist, you'll get the value `undefined` rather than a runtime error.
Because of this, when you _read_ from an optional property, you'll have to check for `undefined` before using it.
在 JavaScript 中，如果你访问一个不存在的属性，你会得到一个未定义的值，而不是一个运行时错误。因此，当您从可选属性读取时，在使用它之前必须检查未定义的属性。

```ts twoslash
// @errors: 2532
function printName(obj: { first: string; last?: string }) {
  // Error - might crash if 'obj.last' wasn't provided!
  console.log(obj.last.toUpperCase());
  if (obj.last !== undefined) {
    // OK
    console.log(obj.last.toUpperCase());
  }

  // A safe alternative using modern JavaScript syntax:
  console.log(obj.last?.toUpperCase());
}
```

## Union Types 联合类型

TypeScript's type system allows you to build new types out of existing ones using a large variety of operators.
Now that we know how to write a few types, it's time to start _combining_ them in interesting ways.
TypeScript 的类型系统允许你使用各种各样的操作符在现有类型的基础上构建新的类型。现在我们知道了如何编写一些类型，是时候开始以有趣的方式组合它们了。

### Defining a Union Type 定义联合类型

The first way to combine types you might see is a _union_ type.
A union type is a type formed from two or more other types, representing values that may be _any one_ of those types.
We refer to each of these types as the union's _members_.
组合类型的第一种方法是联合类型。联合类型是由两个或多个其他类型组成的类型，表示可能是其中任何一个类型的值。我们将这些类型中的每一种称为联合成员。

Let's write a function that can operate on strings or numbers:
让我们编写一个可以操作字符串或数字的函数:

```ts twoslash
// @errors: 2345
function printId(id: number | string) {
  console.log('Your ID is: ' + id);
}
// OK
printId(101);
// OK
printId('202');
// Error
printId({ myID: 22342 });
```

### Working with Union Types 联合类型运行

It's easy to _provide_ a value matching a union type - simply provide a type matching any of the union's members.
If you _have_ a value of a union type, how do you work with it?
提供与 union 类型匹配的值很容易——只需提供与 union 的任何成员匹配的类型即可。如果你有一个联合类型的值，你如何使用它？

TypeScript will only allow you to do things with the union if that thing is valid for _every_ member of the union.
For example, if you have the union `string | number`, you can't use methods that are only available on `string`:
如果 union 对每个成员都有效，则 TypeScript 将只允许您使用 union 进行处理。例如，如果你有联合字符串 | 数字，你不能使用只能在字符串上使用的方法:

```ts twoslash
// @errors: 2339
function printId(id: number | string) {
  console.log(id.toUpperCase());
}
```

The solution is to _narrow_ the union with code, the same as you would in JavaScript without type annotations.
_Narrowing_ occurs when TypeScript can deduce a more specific type for a value based on the structure of the code.
解决方案是用代码缩小联合，就像在 JavaScript 中不使用类型注释一样。当 TypeScript 可以根据代码的结构推断出某个值的更特定的类型时，就会发生收缩。

For example, TypeScript knows that only a `string` value will have a `typeof` value `"string"`:
例如，TypeScript 知道只有一个字符串值才有一个“ string”类型的值:

```ts twoslash
function printId(id: number | string) {
  if (typeof id === 'string') {
    // In this branch, id is of type 'string'
    console.log(id.toUpperCase());
  } else {
    // Here, id is of type 'number'
    console.log(id);
  }
}
```

Another example is to use a function like `Array.isArray`:
另一个例子是使用类似于 Array.isArray 的函数:

```ts twoslash
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // Here: 'x' is 'string[]'
    console.log('Hello, ' + x.join(' and '));
  } else {
    // Here: 'x' is 'string'
    console.log('Welcome lone traveler ' + x);
  }
}
```

Notice that in the `else` branch, we don't need to do anything special - if `x` wasn't a `string[]`, then it must have been a `string`.
注意，在 else 分支中，我们不需要做任何特殊的操作——如果 x 不是字符串[] ，那么它一定是一个字符串。

Sometimes you'll have a union where all the members have something in common.
For example, both arrays and strings have a `slice` method.
If every member in a union has a property in common, you can use that property without narrowing:
有时你会遇到一个所有成员都有共同点的并集。例如，数组和字符串都有一个切片方法。如果联合中的每个成员都有一个共同属性，则可以使用该属性而不进行收缩:

```ts twoslash
// Return type is inferred as number[] | string
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3);
}
```

> It might be confusing that a _union_ of types appears to have the _intersection_ of those types' properties.
> This is not an accident - the name _union_ comes from type theory.
> The _union_ `number | string` is composed by taking the union _of the values_ from each type.联合`number | string`
> Notice that given two sets with corresponding facts about each set, only the _intersection_ of those facts applies to the _union_ of the sets themselves.
> For example, if we had a room of tall people wearing hats, and another room of Spanish speakers wearing hats, after combining those rooms, the only thing we know about _every_ person is that they must be wearing a hat.
> 类型的联合似乎具有这些类型的属性的交集，这可能令人困惑。
> 这并非偶然——联盟的名称来自于类型理论。
> 联合数 | 字符串由每个类型的值的联合组成。
> 请注意，给定两个集合，每个集合都有相应的事实，只有这些事实的交集适用于集合本身的并。
> 例如，如果我们有一个房间的高个子戴着帽子，而另一个房间的西班牙人戴着帽子，在合并了这些房间之后，我们唯一知道的就是每个人都必须戴着帽子。

## Type Aliases 类型别名

We've been using object types and union types by writing them directly in type annotations.
我们通过直接在类型注释中编写对象类型和联合类型来使用它们

This is convenient, but it's common to want to use the same type more than once and refer to it by a single name.
这很方便，但是通常希望多次使用同一类型并使用单个名称引用它。

A _type alias_ is exactly that - a _name_ for any _type_.
The syntax for a type alias is:
类型别名就是——任何类型的名称。类型别名的语法是:

```ts twoslash
type Point = {
  x: number;
  y: number;
};

// Exactly the same as the earlier example
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

You can actually use a type alias to give a name to any type at all, not just an object type.
For example, a type alias can name a union type:
实际上，您可以使用类型别名为任何类型提供名称，而不仅仅是对象类型。例如，类型别名可以命名联合类型:

```ts twoslash
type ID = number | string;
```

Note that aliases are _only_ aliases - you cannot use type aliases to create different/distinct "versions" of the same type.
When you use the alias, it's exactly as if you had written the aliased type.
In other words, this code might _look_ illegal, but is OK according to TypeScript because both types are aliases for the same type:
请注意别名只是别名——您不能使用别名来创建同一类型的不同/不同的“版本”。当您使用别名时，就像您编写了别名类型一样。换句话说，这段代码可能看起来是非法的，但是根据打字稿来看是可以的，因为这两种类型都是同一类型的别名:

```ts twoslash
declare function getInput(): string;
declare function sanitize(str: string): string;
// ---cut---
type UserInputSanitizedString = string;

function sanitizeInput(str: string): UserInputSanitizedString {
  return sanitize(str);
}

// Create a sanitized input
let userInput = sanitizeInput(getInput());

// Can still be re-assigned with a string though
userInput = 'new input';
```

## Interfaces 接口

An _interface declaration_ is another way to name an object type:
接口声明是命名对象类型的另一种方式:

```ts twoslash
interface Point {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

Just like when we used a type alias above, the example works just as if we had used an anonymous object type.
TypeScript is only concerned with the _structure_ of the value we passed to `printCoord` - it only cares that it has the expected properties.
Being concerned only with the structure and capabilities of types is why we call TypeScript a _structurally typed_ type system.
就像我们上面使用类型别名时一样，这个示例的工作方式就像我们使用了匿名对象类型一样。TypeScript 只关心我们传递给 printCoord 的值的结构——它只关心它是否具有预期的属性。仅仅关注类型的结构和功能，这就是为什么我们称打字稿为结构类型系统。

### Differences Between Type Aliases and Interfaces

Type aliases and interfaces are very similar, and in many cases you can choose between them freely.
Almost all features of an `interface` are available in `type`, the key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable.
类型别名和接口非常相似，在许多情况下，您可以在它们之间自由选择。接口的几乎所有特性都是类型可用的，关键区别在于不能重新打开类型以添加新的属性，而接口总是可扩展的。

<table class='full-width-table'>
  <tbody>
    <tr>
      <th><code>Interface</code></th>
      <th><code>Type</code></th>
    </tr>
    <tr>
      <td>
        <p>Extending an interface</p>
        <code><pre>
interface Animal {
  name: string
}<br/>
interface Bear extends Animal {
  honey: boolean
}<br/>
const bear = getBear() 
bear.name
bear.honey
        </pre></code>
      </td>
      <td>
        <p>Extending a type via intersections</p>
        <code><pre>
type Animal = {
  name: string
}<br/>
type Bear = Animal & { 
  honey: boolean 
}<br/>
const bear = getBear();
bear.name;
bear.honey;
        </pre></code>
      </td>
    </tr>
    <tr>
      <td>
        <p>Adding new fields to an existing interface</p>
        <code><pre>
interface Window {
  title: string
}<br/>
interface Window {
  ts: TypeScriptAPI
}<br/>
const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
        </pre></code>
      </td>
      <td>
        <p>A type cannot be changed after being created</p>
        <code><pre>
type Window = {
  title: string
}<br/>
type Window = {
  ts: TypeScriptAPI
}<br/>
<span style="color: #A31515"> // Error: Duplicate identifier 'Window'.</span><br/>
        </pre></code>
      </td>
    </tr>
    </tbody>
</table>

You'll learn more about these concepts in later chapters, so don't worry if you don't understand all of these right away.
在以后的章节中你会学到更多关于这些概念的知识，所以如果你不能马上理解所有这些知识，不要担心。

- Prior to TypeScript version 4.2, type alias names 在 ts 版本 4.2 之前，输入别名 [_may_ appear in error messages](/play?#code/PTAEGEHsFsAcEsA2BTATqNrLusgzngIYDm+oA7koqIYuYQJ56gCueyoAUCKAC4AWHAHaFcoSADMaQ0PCG80EwgGNkALk6c5C1EtWgAsqOi1QAb06groEbjWg8vVHOKcAvpokshy3vEgyyMr8kEbQJogAFND2YREAlOaW1soBeJAoAHSIkMTRmbbI8e6aPMiZxJmgACqCGKhY6ABGyDnkFFQ0dIzMbBwCwqIccabcYLyQoKjIEmh8kwN8DLAc5PzwwbLMyAAeK77IACYaQSEjUWZWhfYAjABMAMwALA+gbsVjoADqgjKESytQPxCHghAByXigYgBfr8LAsYj8aQMUASbDQcRSExCeCwFiIQh+AKfAYyBiQFgOPyIaikSGLQo0Zj-aazaY+dSaXjLDgAGXgAC9CKhDqAALxJaw2Ib2RzOISuDycLw+ImBYKQflCkWRRD2LXCw6JCxS1JCdJZHJ5RAFIbFJU8ADKC3WzEcnVZaGYE1ABpFnFOmsFhsil2uoHuzwArO9SmAAEIsSFrZB-GgAjjA5gtVN8VCEc1o1C4Q4AGlR2AwO1EsBQoAAbvB-gJ4HhPgB5aDwem-Ph1TCV3AEEirTp4ELtRbTPD4vwKjOfAuioSQHuDXBcnmgACC+eCONFEs73YAPGGZVT5cRyyhiHh7AAON7lsG3vBggB8XGV3l8-nVISOgghxoLq9i7io-AHsayRWGaFrlFauq2rg9qaIGQHwCBqChtKdgRo8TxRjeyB3o+7xAA), sometimes in place of the equivalent anonymous type (which may or may not be desirable). Interfaces will always be named in error messages.
- Type aliases may not participate [in declaration merging, but interfaces can](/play?#code/PTAEEEDtQS0gXApgJwGYEMDGjSfdAIx2UQFoB7AB0UkQBMAoEUfO0Wgd1ADd0AbAK6IAzizp16ALgYM4SNFhwBZdAFtV-UAG8GoPaADmNAcMmhh8ZHAMMAvjLkoM2UCvWad+0ARL0A-GYWVpA29gyY5JAWLJAwGnxmbvGgALzauvpGkCZmAEQAjABMAMwALLkANBl6zABi6DB8okR4Jjg+iPSgABboovDk3jjo5pbW1d6+dGb5djLwAJ7UoABKiJTwjThpnpnGpqPBoTLMAJrkArj4kOTwYmycPOhW6AR8IrDQ8N04wmo4HHQCwYi2Waw2W1S6S8HX8gTGITsQA).
- Interfaces may only be used to [declare the shapes of objects, not rename primitives](/play?#code/PTAEAkFMCdIcgM6gC4HcD2pIA8CGBbABwBtIl0AzUAKBFAFcEBLAOwHMUBPQs0XFgCahWyGBVwBjMrTDJMAshOhMARpD4tQ6FQCtIE5DWoixk9QEEWAeV37kARlABvaqDegAbrmL1IALlAEZGV2agBfampkbgtrWwMAJlAAXmdXdy8ff0Dg1jZwyLoAVWZ2Lh5QVHUJflAlSFxROsY5fFAWAmk6CnRoLGwmILzQQmV8JmQmDzI-SOiKgGV+CaYAL0gBBdyy1KCQ-Pn1AFFplgA5enw1PtSWS+vCsAAVAAtB4QQWOEMKBuYVUiVCYvYQsUTQcRSBDGMGmKSgAAa-VEgiQe2GLgKQA).
- Interface names will [_always_ appear in their original form](/play?#code/PTAEGEHsFsAcEsA2BTATqNrLusgzngIYDm+oA7koqIYuYQJ56gCueyoAUCKAC4AWHAHaFcoSADMaQ0PCG80EwgGNkALk6c5C1EtWgAsqOi1QAb06groEbjWg8vVHOKcAvpokshy3vEgyyMr8kEbQJogAFND2YREAlOaW1soBeJAoAHSIkMTRmbbI8e6aPMiZxJmgACqCGKhY6ABGyDnkFFQ0dIzMbBwCwqIccabcYLyQoKjIEmh8kwN8DLAc5PzwwbLMyAAeK77IACYaQSEjUWY2Q-YAjABMAMwALA+gbsVjNXW8yxySoAADaAA0CCaZbPh1XYqXgOIY0ZgmcK0AA0nyaLFhhGY8F4AHJmEJILCWsgZId4NNfIgGFdcIcUTVfgBlZTOWC8T7kAJ42G4eT+GS42QyRaYbCgXAEEguTzeXyCjDBSAAQSE8Ai0Xsl0K9kcziExDeiQs1lAqSE6SyOTy0AKQ2KHk4p1V6s1OuuoHuzwArMagA) in error messages, but _only_ when they are used by name.

For the most part, you can choose based on personal preference, and TypeScript will tell you if it needs something to be the other kind of declaration. If you would like a heuristic, use `interface` until you need to use features from `type`.
在大多数情况下，你可以根据个人喜好进行选择，打字稿会告诉你是否需要其他类型的声明。如果你想要一个启发式的，使用界面，直到你需要使用类型的特性。

## Type Assertions

Sometimes you will have information about the type of a value that TypeScript can't know about.
有时候，你会得到一个值的类型信息，而 TypeScript 是不能知道的。

For example, if you're using `document.getElementById`, TypeScript only knows that this will return _some_ kind of `HTMLElement`, but you might know that your page will always have an `HTMLCanvasElement` with a given ID.
例如，如果您使用 document.getElementById，TypeScript 只知道这会返回某种类型的 HTMLElement，但是您可能知道您的页面将始终有一个带有给定 ID 的 HTMLCanvasElement。

In this situation, you can use a _type assertion_ to specify a more specific type:
在这种情况下，你可以使用一个类型断言来指定一个更具体的类型:

```ts twoslash
const myCanvas = document.getElementById('main_canvas') as HTMLCanvasElement;
```

Like a type annotation, type assertions are removed by the compiler and won't affect the runtime behavior of your code.
与类型注释一样，类型断言由编译器移除，不会影响代码的运行时行为。

You can also use the angle-bracket syntax (except if the code is in a `.tsx` file), which is equivalent:
您还可以使用尖括号语法(除非代码位于.tsx 文件中) ，这是等效的:

```ts twoslash
const myCanvas = <HTMLCanvasElement>document.getElementById('main_canvas');
```

> Reminder: Because type assertions are removed at compile-time, there is no runtime checking associated with a type assertion.
> There won't be an exception or `null` generated if the type assertion is wrong.
> 提醒: 因为类型断言是在编译时删除的，所以不存在与类型断言关联的运行时检查。
> 如果类型断言错误，则不会生成异常或 null。

TypeScript only allows type assertions which convert to a _more specific_ or _less specific_ version of a type.
This rule prevents "impossible" coercions like:
打字稿只允许类型断言转换为更具体或更不具体的类型版本。这条规则可以防止“不可能”的强制性条款，比如:

```ts twoslash
// @errors: 2352
const x = 'hello' as number;
```

Sometimes this rule can be too conservative and will disallow more complex coercions that might be valid.
If this happens, you can use two assertions, first to `any` (or `unknown`, which we'll introduce later), then to the desired type:
有时这个规则可能过于保守，不允许更复杂的有效强制。如果发生这种情况，你可以使用两个断言，首先是对任何(或者未知，我们将在后面介绍) ，然后是所需的类型:

```ts twoslash
declare const expr: any;
type T = { a: 1; b: 2; c: 3 };
// ---cut---
const a = expr as any as T;
```

## Literal Types 字面量类型

In addition to the general types `string` and `number`, we can refer to _specific_ strings and numbers in type positions.
除了一般类型字符串和数字之外，我们还可以在类型位置中引用特定的字符串和数字。

One way to think about this is to consider how JavaScript comes with different ways to declare a variable. Both `var` and `let` allow for changing what is held inside the variable, and `const` does not. This is reflected in how TypeScript creates types for literals.
考虑这个问题的一种方法是考虑 JavaScript 是如何以不同的方式声明变量的。Var 和 let 都允许改变变量内部的值，而 const 不允许。这反映在 TypeScript 如何为文本创建类型上。

```ts twoslash
let changingString = 'Hello World';
changingString = 'Olá Mundo';
// Because `changingString` can represent any possible string, that
// is how TypeScript describes it in the type system
changingString;
// ^?

const constantString = 'Hello World';
// Because `constantString` can only represent 1 possible string, it
// has a literal type representation
constantString;
// ^?
```

By themselves, literal types aren't very valuable:
字面量类型本身并不是很有价值:

```ts twoslash
// @errors: 2322
let x: 'hello' = 'hello';
// OK
x = 'hello';
// ...
x = 'howdy';
```

It's not much use to have a variable that can only have one value!
拥有一个只能有一个值的变量没有多大用处！

But by _combining_ literals into unions, you can express a much more useful concept - for example, functions that only accept a certain set of known values:
但是，通过将文字组合成联合，可以表达一个更有用的概念——例如，只接受一组已知值的函数:

```ts twoslash
// @errors: 2345
function printText(s: string, alignment: 'left' | 'right' | 'center') {
  // ...
}
printText('Hello, world', 'left');
printText("G'day, mate", 'centre');
```

Numeric literal types work the same way:
数值文字类型的工作原理是相同的:

```ts twoslash
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

Of course, you can combine these with non-literal types:
当然，你可以把它们和非字面量类型结合起来:

```ts twoslash
// @errors: 2345
interface Options {
  width: number;
}
function configure(x: Options | 'auto') {
  // ...
}
configure({ width: 100 });
configure('auto');
configure('automatic');
```

There's one more kind of literal type: boolean literals.
There are only two boolean literal types, and as you might guess, they are the types `true` and `false`.
The type `boolean` itself is actually just an alias for the union `true | false`.
还有一种字面量类型: 布尔文字。只有两种布尔文字类型，正如您可能猜到的，它们是 true 和 false 类型。类型 boolean 本身实际上只是 union true | false 的别名。

### Literal Inference 字面推理

When you initialize a variable with an object, TypeScript assumes that the properties of that object might change values later.
For example, if you wrote code like this:
当使用对象初始化变量时，TypeScript 假定该对象的属性稍后可能更改值。例如，如果你写了这样的代码:

```ts twoslash
declare const someCondition: boolean;
// ---cut---
const obj = { counter: 0 };
if (someCondition) {
  obj.counter = 1;
}
```

TypeScript doesn't assume the assignment of `1` to a field which previously had `0` is an error.
Another way of saying this is that `obj.counter` must have the type `number`, not `0`, because types are used to determine both _reading_ and _writing_ behavior.
TypeScript 不会假设将 1 分配给先前有 0 的字段是一个错误。另一种说法是 obj.counter 必须具有类型编号，而不是 0，因为类型用于决定读取和写入行为。

The same applies to strings:

```ts twoslash
// @errors: 2345
declare function handleRequest(url: string, method: 'GET' | 'POST'): void;
// ---cut---
const req = { url: 'https://example.com', method: 'GET' };
handleRequest(req.url, req.method);
```

In the above example `req.method` is inferred to be `string`, not `"GET"`. Because code can be evaluated between the creation of `req` and the call of `handleRequest` which could assign a new string like `"GUESS"` to `req.method`, TypeScript considers this code to have an error.
在上面的示例中，req.method 被推断为 string，而不是“ GET”。因为代码可以在 req 的创建和 handleRequest 的调用之间进行计算，handleRequest 可以为 req.method 分配一个新字符串，比如“ GUESS”，所以 TypeScript 认为这段代码有错误。

There are two ways to work around this.
有两种方法可以解决这个问题。

1. You can change the inference by adding a type assertion in either location:
   您可以通过在任一位置添加类型断言来更改推断:

   ```ts twoslash
   declare function handleRequest(url: string, method: 'GET' | 'POST'): void;
   // ---cut---
   // Change 1:
   const req = { url: 'https://example.com', method: 'GET' as 'GET' };
   // Change 2
   handleRequest(req.url, req.method as 'GET');
   ```

   Change 1 means "I intend for `req.method` to always have the _literal type_ `"GET"`", preventing the possible assignment of `"GUESS"` to that field after.
   Change 2 means "I know for other reasons that `req.method` has the value `"GET"`".
   更改 1 意味着“我希望 req.method 始终具有文本类型“ GET”，这样可以防止“ GUESS”被赋值到后面的字段。Change 2 意味着“因为其他原因，我知道 req.method 的值为“ GET”。

2. You can use `as const` to convert the entire object to be type literals:
   可以使用 `as const` 将整个对象转换为字面量类型:

   ```ts twoslash
   declare function handleRequest(url: string, method: 'GET' | 'POST'): void;
   // ---cut---
   const req = { url: 'https://example.com', method: 'GET' } as const;
   handleRequest(req.url, req.method);
   ```

The `as const` suffix acts like `const` but for the type system, ensuring that all properties are assigned the literal type instead of a more general version like `string` or `number`.
As const 后缀的作用类似于 const，但是对于类型系统，确保所有属性都被分配为文本类型，而不是字符串或数字之类的更一般的版本。

## `null` and `undefined`

JavaScript has two primitive values used to signal absent or uninitialized value: `null` and `undefined`.
JavaScript 有两个用于表示缺失或未初始化值的基本值: null 和 undefined。

TypeScript has two corresponding _types_ by the same names. How these types behave depends on whether you have the [`strictNullChecks`](/tsconfig#strictNullChecks) option on.
TypeScript 有两个相同名字的对应类型。这些类型的行为取决于是否启用了 stritnullchecks 选项。

### `strictNullChecks` off 关闭

With [`strictNullChecks`](/tsconfig#strictNullChecks) _off_, values that might be `null` or `undefined` can still be accessed normally, and the values `null` and `undefined` can be assigned to a property of any type.
This is similar to how languages without null checks (e.g. C#, Java) behave.
The lack of checking for these values tends to be a major source of bugs; we always recommend people turn [`strictNullChecks`](/tsconfig#strictNullChecks) on if it's practical to do so in their codebase.
关闭 strictnullcheck 后，仍然可以正常访问可能为 null 或未定义的值，null 和未定义的值可以分配给任何类型的属性。这类似于没有空检查的语言(例如 c # 、 Java)的行为。缺乏对这些值的检查往往是 bug 的一个主要来源; 我们总是建议人们在他们的代码库中开启 [`strictNullChecks`](/tsconfig#strictNullChecks)，如果在他们的代码库中这样做是可行的。

### `strictNullChecks` on

With [`strictNullChecks`](/tsconfig#strictNullChecks) _on_, when a value is `null` or `undefined`, you will need to test for those values before using methods or properties on that value.
Just like checking for `undefined` before using an optional property, we can use _narrowing_ to check for values that might be `null`:
使用 strictNullChecks，当一个值为空或未定义时，您需要在对该值使用方法或属性之前测试这些值。就像在使用可选属性之前检查未定义的值一样，我们可以使用收缩来检查可能为 null 的值:

```ts twoslash
function doSomething(x: string | null) {
  if (x === null) {
    // do nothing
  } else {
    console.log('Hello, ' + x.toUpperCase());
  }
}
```

### Non-null Assertion Operator (Postfix `!`)非空断言运算符

TypeScript also has a special syntax for removing `null` and `undefined` from a type without doing any explicit checking.
Writing `!` after any expression is effectively a type assertion that the value isn't `null` or `undefined`:
TypeScript 还有一种特殊的语法，用于在不进行任何显式检查的情况下从类型中删除 null 和未定义的内容。写作！在任何表达式之后都是一个类型断言，该值不是 null 或未定义的:

```ts twoslash
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

Just like other type assertions, this doesn't change the runtime behavior of your code, so it's important to only use `!` when you know that the value _can't_ be `null` or `undefined`.
就像其他类型断言一样，这不会改变代码的运行时行为，因此只使用它是很重要的！当您知道该值不能为`null` 或`undefined`时。

## Enums 枚举

Enums are a feature added to JavaScript by TypeScript which allows for describing a value which could be one of a set of possible named constants. Unlike most TypeScript features, this is _not_ a type-level addition to JavaScript but something added to the language and runtime. Because of this, it's a feature which you should know exists, but maybe hold off on using unless you are sure. You can read more about enums in the [Enum reference page](/docs/handbook/enums.html).
是由 TypeScript 添加到 JavaScript 的一个特性，它允许描述一个值，这个值可以是一组可能的命名常量之一。与大多数打字脚本特性不同，这不是 JavaScript 的类型级别增加，而是添加到语言和运行时中的。正因为如此，这是一个你应该知道存在的特性，但是除非你确定，否则可以推迟使用。您可以在 Enum 参考页面中阅读更多有关 Enum 的内容。

## Less Common Primitives 不太常见的原始类型

It's worth mentioning the rest of the primitives in JavaScript which are represented in the type system.
Though we will not go into depth here.
值得一提的是 JavaScript 中的其余原始类型，它们在类型系统中表示。虽然我们不会在这里深入探讨。

#### `bigint`

From ES2020 onwards, there is a primitive in JavaScript used for very large integers, `BigInt`:
从 ES2020 开始，JavaScript 中有一个用于非常大的整数的原语，BigInt:

```ts twoslash
// @target: es2020

// Creating a bigint via the BigInt function
const oneHundred: bigint = BigInt(100);

// Creating a BigInt via the literal syntax
const anotherHundred: bigint = 100n;
```

You can learn more about BigInt in [the TypeScript 3.2 release notes](/docs/handbook/release-notes/typescript-3-2.html#bigint).
您可以在 [the TypeScript 3.2 release notes](/docs/handbook/release-notes/typescript-3-2.html#bigint)了解更多关于 BigInt 的信息。

#### `symbol`

There is a primitive in JavaScript used to create a globally unique reference via the function `Symbol()`:
JavaScript 中有一个原始类型，用于通过函数 Symbol ()创建一个全局唯一引用:

```ts twoslash
// @errors: 2367
const firstName = Symbol('name');
const secondName = Symbol('name');

if (firstName === secondName) {
  // Can't ever happen
}
```

You can learn more about them in [Symbols reference page](/docs/handbook/symbols.html).
