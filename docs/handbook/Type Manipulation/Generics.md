---
title: Generics
layout: docs
permalink: /docs/handbook/2/generics.html
oneline: Types which take parameters
---

A major part of software engineering is building components that not only have well-defined and consistent APIs, but are also reusable.
Components that are capable of working on the data of today as well as the data of tomorrow will give you the most flexible capabilities for building up large software systems.

软件工程的一个主要部分是构建组件，这些组件不仅具有定义良好和一致的 api，而且还是可重用的。能够处理今天的数据和明天的数据的组件将为您提供构建大型软件系统的最灵活的能力。

In languages like C# and Java, one of the main tools in the toolbox for creating reusable components is _generics_, that is, being able to create a component that can work over a variety of types rather than a single one.
This allows users to consume these components and use their own types.
在 c # 和 Java 这样的语言中，工具箱中用来创建可重用组件的主要工具之一是泛型，也就是说，能够创建一个可以跨多种类型而不是单一类型工作的组件。这允许用户使用这些组件并使用他们自己的类型。



## Hello World of Generics 泛型的世界

To start off, let's do the "hello world" of generics: the identity function.
The identity function is a function that will return back whatever is passed in.
You can think of this in a similar way to the `echo` command.
首先，让我们来做泛型的“ hello world”: 标识函数。恒等函数是一个函数，它将返回所有传入的内容。您可以以类似于 echo 命令的方式来考虑这个问题。



Without generics, we would either have to give the identity function a specific type:
如果没有泛型，我们将不得不给身份函数一个特定的类型:



```ts twoslash
function identity(arg: number): number {
  return arg;
}
```

Or, we could describe the identity function using the `any` type:
或者，我们可以使用任意类型来描述身份函数:


```ts twoslash
function identity(arg: any): any {
  return arg;
}
```

While using `any` is certainly generic in that it will cause the function to accept any and all types for the type of `arg`, we actually are losing the information about what that type was when the function returns.
If we passed in a number, the only information we have is that any type could be returned.
虽然使用 any 肯定是泛型的，因为它会导致函数接受 arg 类型的任何和所有类型，但是当函数返回时，我们实际上正在丢失关于该类型是什么的信息。如果我们传入一个数字，那么我们得到的唯一信息就是任何类型都可以返回。



Instead, we need a way of capturing the type of the argument in such a way that we can also use it to denote what is being returned.
Here, we will use a _type variable_, a special kind of variable that works on types rather than values.
相反，我们需要一种捕获参数类型的方法，这种方法也可以用来表示返回的内容。这里，我们将使用一个类型变量，这是一种特殊的变量，可以处理类型而不是值。


```ts twoslash
function identity<Type>(arg: Type): Type {
  return arg;
}
```

We've now added a type variable `Type` to the identity function.
This `Type` allows us to capture the type the user provides (e.g. `number`), so that we can use that information later.
Here, we use `Type` again as the return type. On inspection, we can now see the same type is used for the argument and the return type.
This allows us to traffic that type information in one side of the function and out the other.
我们现在已经为标识函数添加了一个类型变量 Type。这种类型允许我们捕获用户提供的类型(例如数字) ，这样我们以后就可以使用这些信息。在这里，我们再次使用 Type 作为返回类型。经过检查，我们现在可以看到参数和返回类型使用了相同的类型。这允许我们在函数的一端传输该类型的信息，而在另一端传输该类型的信息。



We say that this version of the `identity` function is generic, as it works over a range of types.
Unlike using `any`, it's also just as precise (ie, it doesn't lose any information) as the first `identity` function that used numbers for the argument and return type.
我们说这个版本的标识函数是通用的，因为它可以在一系列类型中工作。与使用 any 不同，它与使用数字作为参数和返回类型的第一个恒等式函数一样精确(也就是说，它不会丢失任何信息)。



Once we've written the generic identity function, we can call it in one of two ways.
The first way is to pass all of the arguments, including the type argument, to the function:
一旦我们编写了泛型标识函数，我们可以用两种方法之一来调用它。第一种方法是将所有参数，包括类型参数，传递给函数:


```ts twoslash
function identity<Type>(arg: Type): Type {
  return arg;
}
// ---cut---
let output = identity<string>("myString");
//       ^?
```

Here we explicitly set `Type` to be `string` as one of the arguments to the function call, denoted using the `<>` around the arguments rather than `()`.
在这里，我们显式地将 Type 设置为 string，作为函数调用的参数之一，用参数周围的 < > 表示，而不是()。



The second way is also perhaps the most common. Here we use _type argument inference_ -- that is, we want the compiler to set the value of `Type` for us automatically based on the type of the argument we pass in:
第二种方式也许也是最常见的。这里我们使用类型参数推断ーー也就是说，我们希望编译器根据我们传入的参数的类型自动为我们设置 Type 的值:

```ts twoslash
function identity<Type>(arg: Type): Type {
  return arg;
}
// ---cut---
let output = identity("myString");
//       ^?
```

Notice that we didn't have to explicitly pass the type in the angle brackets (`<>`); the compiler just looked at the value `"myString"`, and set `Type` to its type.
While type argument inference can be a helpful tool to keep code shorter and more readable, you may need to explicitly pass in the type arguments as we did in the previous example when the compiler fails to infer the type, as may happen in more complex examples.
注意，我们不必显式地将类型传递到尖括号中(< >) ; 编译器只需查看值“ myString”，并将 Type 设置为其类型。虽然类型参数推断是一个有用的工具，可以使代码更短，更具可读性，但是你可能需要显式地传入类型参数，就像我们在前面的例子中所做的那样，当编译器无法推断出类型时，就像在更复杂的例子中可能发生的那样。

## Working with Generic Type Variables 使用泛型类型变量


When you begin to use generics, you'll notice that when you create generic functions like `identity`, the compiler will enforce that you use any generically typed parameters in the body of the function correctly.
That is, that you actually treat these parameters as if they could be any and all types.
当您开始使用泛型时，您将注意到，当您创建诸如 identity 之类的泛型函数时，编译器将强制您在函数体中正确使用任何泛型类型的参数。也就是说，您实际上将这些参数视为它们可以是任意和所有类型。



Let's take our `identity` function from earlier:
让我们从前面的身份函数开始:



```ts twoslash
function identity<Type>(arg: Type): Type {
  return arg;
}
```

What if we want to also log the length of the argument `arg` to the console with each call?
We might be tempted to write this:
如果我们还想在每次调用时将参数 arg 的长度记录到控制台，该怎么办？我们可能会写下这样的话:



```ts twoslash
// @errors: 2339
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length);
  return arg;
}
```

When we do, the compiler will give us an error that we're using the `.length` member of `arg`, but nowhere have we said that `arg` has this member.
Remember, we said earlier that these type variables stand in for any and all types, so someone using this function could have passed in a `number` instead, which does not have a `.length` member.
当我们这样做的时候，编译器会给我们一个错误，我们正在使用。Arg 的长度成员，但我们没有说过 arg 有这个成员。记住，我们前面说过这些类型变量代表任何和所有类型，所以使用这个函数的人可以传入一个数字，而这个数字没有。长度构件。



Let's say that we've actually intended this function to work on arrays of `Type` rather than `Type` directly. Since we're working with arrays, the `.length` member should be available.
We can describe this just like we would create arrays of other types:
假设我们实际上希望这个函数处理 Type 数组，而不是直接处理 Type。因为我们使用数组，所以。长度成员应该可用。我们可以像创建其他类型的数组一样来描述它:


```ts twoslash {1}
function loggingIdentity<Type>(arg: Type[]): Type[] {
  console.log(arg.length);
  return arg;
}
```

You can read the type of `loggingIdentity` as "the generic function `loggingIdentity` takes a type parameter `Type`, and an argument `arg` which is an array of `Type`s, and returns an array of `Type`s."
If we passed in an array of numbers, we'd get an array of numbers back out, as `Type` would bind to `number`.
This allows us to use our generic type variable `Type` as part of the types we're working with, rather than the whole type, giving us greater flexibility.
可以将 log龈实体的类型读取为“ generic function log龈实体接受类型参数 Type 和参数 arg (类型数组)并返回类型数组”如果我们传入一个数字数组，我们会得到一个数组返回，就像 Type 会绑定到 number 一样。这允许我们使用泛型类型变量 Type 作为正在使用的类型的一部分，而不是整个类型，从而提供了更大的灵活性。



We can alternatively write the sample example this way:
我们也可以用这种方式来编写示例:


```ts twoslash {1}
function loggingIdentity<Type>(arg: Array<Type>): Array<Type> {
  console.log(arg.length); // Array has a .length, so no more error
  return arg;
}
```

You may already be familiar with this style of type from other languages.
In the next section, we'll cover how you can create your own generic types like `Array<Type>`.
您可能已经熟悉这种类型的其他语言。在下一节中，我们将介绍如何创建自己的泛型类型，如 Array < type > 。


## Generic Types 泛型

In previous sections, we created generic identity functions that worked over a range of types.
In this section, we'll explore the type of the functions themselves and how to create generic interfaces.
在前面的部分中，我们创建了适用于一系列类型的泛型标识函数。在本节中，我们将探讨函数本身的类型以及如何创建泛型接口。



The type of generic functions is just like those of non-generic functions, with the type parameters listed first, similarly to function declarations:
泛型函数的类型与非泛型函数类似，类型参数列在前面，类似于函数声明:



```ts twoslash
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: <Type>(arg: Type) => Type = identity;
```

We could also have used a different name for the generic type parameter in the type, so long as the number of type variables and how the type variables are used line up.
我们也可以为类型中的泛型类型参数使用不同的名称，只要类型变量的数量和类型变量的使用方式是一致的。


```ts twoslash
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: <Input>(arg: Input) => Input = identity;
```

We can also write the generic type as a call signature of an object literal type:
我们也可以将泛型类型写作为对象文本类型的调用签名:


```ts twoslash
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: { <Type>(arg: Type): Type } = identity;
```

Which leads us to writing our first generic interface.
Let's take the object literal from the previous example and move it to an interface:
这使我们编写了我们的第一个通用界面。让我们把前面例子中的 object literal 移动到一个接口:


```ts twoslash
interface GenericIdentityFn {
  <Type>(arg: Type): Type;
}

function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

In a similar example, we may want to move the generic parameter to be a parameter of the whole interface.
This lets us see what type(s) we're generic over (e.g. `Dictionary<string>` rather than just `Dictionary`).
This makes the type parameter visible to all the other members of the interface.
在类似的示例中，我们可能希望将泛型参数移动为整个接口的参数。这让我们知道我们是泛型的(比如 Dictionary < string > 而不仅仅是 Dictionary)。这使得 type 参数对接口的所有其他成员可见。



```ts twoslash
interface GenericIdentityFn<Type> {
  (arg: Type): Type;
}

function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

Notice that our example has changed to be something slightly different.
Instead of describing a generic function, we now have a non-generic function signature that is a part of a generic type.
When we use `GenericIdentityFn`, we now will also need to specify the corresponding type argument (here: `number`), effectively locking in what the underlying call signature will use.
Understanding when to put the type parameter directly on the call signature and when to put it on the interface itself will be helpful in describing what aspects of a type are generic.
请注意，我们的示例已经变得稍有不同。与描述泛型函数不同，我们现在有一个非泛型函数签名，它是泛型类型的一部分。当我们使用 GenericIdentityFn 时，我们现在还需要指定相应的类型参数(这里: number) ，有效地锁定底层调用签名将使用的内容。理解何时将类型参数直接放在调用签名上，何时将其放在接口本身上，将有助于描述类型的哪些方面是泛型的。


In addition to generic interfaces, we can also create generic classes.
Note that it is not possible to create generic enums and namespaces.
除了泛型接口，我们还可以创建泛型类。请注意，不可能创建通用的 enums 和 namespaces。


## Generic Classes 泛型类

A generic class has a similar shape to a generic interface.
Generic classes have a generic type parameter list in angle brackets (`<>`) following the name of the class.
泛型类具有与泛型接口类似的形状。泛型类的名称后面的尖括号(< >)中有一个泛型类型参数列表。



```ts twoslash
// @strict: false
class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```

This is a pretty literal use of the `GenericNumber` class, but you may have noticed that nothing is restricting it to only use the `number` type.
We could have instead used `string` or even more complex objects.
这是对 GenericNumber 类的一个相当字面的使用，但是您可能已经注意到没有任何限制它只使用数字类型。我们可以用字符串或者更复杂的对象来代替。


```ts twoslash
// @strict: false
class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}
// ---cut---
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function (x, y) {
  return x + y;
};

console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));
```

Just as with interface, putting the type parameter on the class itself lets us make sure all of the properties of the class are working with the same type.
就像使用 interface 一样，将 type 参数放在类本身上可以让我们确保类的所有属性都使用相同的类型。



As we cover in [our section on classes](/docs/handbook/2/classes.html), a class has two sides to its type: the static side and the instance side.
Generic classes are only generic over their instance side rather than their static side, so when working with classes, static members can not use the class's type parameter.
正如我们在关于类的章节中所介绍的，类的类型有两个方面: 静态方面和实例方面。泛型类只是泛型的实例端而不是静态端，因此在处理类时，静态成员不能使用类的类型参数。



## Generic Constraints泛型约束

If you remember from an earlier example, you may sometimes want to write a generic function that works on a set of types where you have _some_ knowledge about what capabilities that set of types will have.
In our `loggingIdentity` example, we wanted to be able to access the `.length` property of `arg`, but the compiler could not prove that every type had a `.length` property, so it warns us that we can't make this assumption.
如果您还记得前面的一个例子，那么有时您可能想要编写一个泛型函数，它可以在一组类型上工作，在这些类型上您可以了解这组类型将具有哪些功能。在我们的 log龈实体示例中，我们希望能够访问。的 length 属性，但是编译器不能证明每个类型都有。长度属性，所以它警告我们，我们不能做出这种假设。



```ts twoslash
// @errors: 2339
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length);
  return arg;
}
```

Instead of working with any and all types, we'd like to constrain this function to work with any and all types that *also*  have the `.length` property.
As long as the type has this member, we'll allow it, but it's required to have at least this member.
To do so, we must list our requirement as a constraint on what `Type` can be.
与使用任何和所有类型不同，我们希望约束这个函数使其能够使用任何和所有同样具有。长度特性。只要类型有这个成员，我们就允许它，但是它至少需要有这个成员。要做到这一点，我们必须将我们的需求列为 Type 可以是什么的约束。



To do so, we'll create an interface that describes our constraint.
Here, we'll create an interface that has a single `.length` property and then we'll use this interface and the `extends` keyword to denote our constraint:
为此，我们将创建一个描述约束的接口。在这里，我们将创建一个接口，它有一个单一的。属性，然后我们使用这个接口和 extends 关键字来表示我们的约束:



```ts twoslash
interface Lengthwise {
  length: number;
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length); // Now we know it has a .length property, so no more error
  return arg;
}
```

Because the generic function is now constrained, it will no longer work over any and all types:
因为泛型函数现在受到约束，它将不再适用于任何和所有类型:


```ts twoslash
// @errors: 2345
interface Lengthwise {
  length: number;
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length);
  return arg;
}
// ---cut---
loggingIdentity(3);
```

Instead, we need to pass in values whose type has all the required properties:
相反，我们需要传入具有所有必需属性的类型:


```ts twoslash
interface Lengthwise {
  length: number;
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length);
  return arg;
}
// ---cut---
loggingIdentity({ length: 10, value: 3 });
```

## Using Type Parameters in Generic Constraints在泛型约束中使用类型参数


You can declare a type parameter that is constrained by another type parameter.
For example, here we'd like to get a property from an object given its name.
We'd like to ensure that we're not accidentally grabbing a property that does not exist on the `obj`, so we'll place a constraint between the two types:
可以声明受其他类型参数约束的类型参数。例如，这里我们希望从给定名称的对象获取一个属性。我们希望确保我们不会意外地抓取 obj 上不存在的属性，因此我们将在两种类型之间设置一个约束:



```ts twoslash
// @errors: 2345
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a");
getProperty(x, "m");
```

## Using Class Types in Generics

When creating factories in TypeScript using generics, it is necessary to refer to class types by their constructor functions. For example,
当使用泛型在 TypeScript 中创建工厂时，必须通过类的构造函数引用类类型。比如说,



```ts twoslash
function create<Type>(c: { new (): Type }): Type {
  return new c();
}
```

A more advanced example uses the prototype property to infer and constrain relationships between the constructor function and the instance side of class types.
一个更高级的示例使用 prototype 属性来推断和约束构造函数和类类型的实例端之间的关系。


```ts twoslash
// @strict: false
class BeeKeeper {
  hasMask: boolean = true;
}

class ZooKeeper {
  nametag: string = "Mikle";
}

class Animal {
  numLegs: number = 4;
}

class Bee extends Animal {
  keeper: BeeKeeper = new BeeKeeper();
}

class Lion extends Animal {
  keeper: ZooKeeper = new ZooKeeper();
}

function createInstance<A extends Animal>(c: new () => A): A {
  return new c();
}

createInstance(Lion).keeper.nametag;
createInstance(Bee).keeper.hasMask;
```

This pattern is used to power the [mixins](/docs/handbook/mixins.html) design pattern.
此模式用于为混合器设计模式提供动力。

