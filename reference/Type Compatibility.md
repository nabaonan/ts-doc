---
title: Type Compatibility
layout: docs
permalink: /docs/handbook/type-compatibility.html
oneline: How type-checking works in TypeScript
translatable: true
---

Type compatibility in TypeScript is based on structural subtyping.
Structural typing is a way of relating types based solely on their members.
This is in contrast with nominal typing.
Consider the following code:

TypeScript 中的类型兼容性基于结构子类型。结构类型是一种仅基于成员关联类型的方法。这与名义类型形成对比。考虑下面的代码:

```ts
interface Pet {
  name: string;
}

class Dog {
  name: string;
}

let pet: Pet;
// OK, because of structural typing
pet = new Dog();
```

In nominally-typed languages like C# or Java, the equivalent code would be an error because the `Dog` class does not explicitly describe itself as being an implementer of the `Pet` interface.

在名义上类型化的语言(如 c # 或 Java)中，等价的代码将是一个错误，因为 Dog 类没有将自己显式地描述为 Pet 接口的一个实现者。

TypeScript's structural type system was designed based on how JavaScript code is typically written.
Because JavaScript widely uses anonymous objects like function expressions and object literals, it's much more natural to represent the kinds of relationships found in JavaScript libraries with a structural type system instead of a nominal one.

TypeScript的结构类型系统是基于 JavaScript 代码的典型编写方式设计的。因为 JavaScript 广泛使用匿名对象，比如函数表达式和对象文本，所以用结构类型系统而不是名义类型系统来表示 JavaScript 库中的关系要自然得多。

## A Note on Soundness 关于稳健性的一点注释

TypeScript's type system allows certain operations that can't be known at compile-time to be safe. When a type system has this property, it is said to not be "sound". The places where TypeScript allows unsound behavior were carefully considered, and throughout this document we'll explain where these happen and the motivating scenarios behind them.

TypeScript的类型系统允许在编译时无法知道的某些操作是安全的。当一个类型系统具有这个属性时，就说它不“健全”。允许不健全行为的地方已经被仔细考虑过了，在本文中我们将解释这些发生的地方和背后的激励场景。

## Starting out 开始

The basic rule for TypeScript's structural type system is that `x` is compatible with `y` if `y` has at least the same members as `x`. For example consider the following code involving an interface named `Pet` which has a `name` property:

TypeScript的结构类型系统的基本规则是，如果 y 和 x 有至少相同的成员，那么 x 和 y 是兼容的:

```ts
interface Pet {
  name: string;
}

let pet: Pet;
// dog's inferred type is { name: string; owner: string; }
let dog = { name: "Lassie", owner: "Rudd Weatherwax" };
pet = dog;
```

To check whether `dog` can be assigned to `pet`, the compiler checks each property of `pet` to find a corresponding compatible property in `dog`.
In this case, `dog` must have a member called `name` that is a string. It does, so the assignment is allowed.

为了检查 dog 是否可以被分配给 pet，编译器检查 pet 的每个属性以在 dog 中找到相应的兼容属性。在这种情况下，dog 必须有一个名为 name 的成员，该成员是一个字符串。确实如此，所以赋值是允许的。

The same rule for assignment is used when checking function call arguments:

在检查函数调用参数时也使用了同样的赋值规则:

```ts
interface Pet {
  name: string;
}

let dog = { name: "Lassie", owner: "Rudd Weatherwax" };

function greet(pet: Pet) {
  console.log("Hello, " + pet.name);
}
greet(dog); // OK
```

Note that `dog` has an extra `owner` property, but this does not create an error.
Only members of the target type (`Pet` in this case) are considered when checking for compatibility.

注意，dog 有一个额外的 owner 属性，但是这不会产生错误。在检查兼容性时，只考虑目标类型的成员(本例中为 Pet)。

This comparison process proceeds recursively, exploring the type of each member and sub-member.

这个比较过程递归地进行，探索每个成员和子成员的类型。

## Comparing two functions 比较两个函数

While comparing primitive types and object types is relatively straightforward, the question of what kinds of functions should be considered compatible is a bit more involved.
Let's start with a basic example of two functions that differ only in their parameter lists:

虽然比较基本类型和对象类型相对比较简单，但涉及到哪些类型的函数应该被认为是兼容的问题。让我们从两个函数的基本例子开始，这两个函数只有参数列表不同:

```ts
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; // OK
x = y; // Error
```

To check if `x` is assignable to `y`, we first look at the parameter list.
Each parameter in `x` must have a corresponding parameter in `y` with a compatible type.
Note that the names of the parameters are not considered, only their types.
In this case, every parameter of `x` has a corresponding compatible parameter in `y`, so the assignment is allowed.

为了检查 x 是否可以赋值给 y，我们首先看一下参数列表。X 中的每个参数必须在 y 中有一个相应的参数，并且具有兼容的类型。注意，不考虑参数的名称，只考虑它们的类型。在这种情况下，x 的每个参数在 y 中都有一个相应的兼容参数，因此允许赋值。

The second assignment is an error, because `y` has a required second parameter that `x` does not have, so the assignment is disallowed.

第二个赋值是一个错误，因为 y 有一个必需的第二个参数，而 x 没有，所以不允许赋值。

You may be wondering why we allow 'discarding' parameters like in the example `y = x`.
The reason for this assignment to be allowed is that ignoring extra function parameters is actually quite common in JavaScript.
For example, `Array#forEach` provides three parameters to the callback function: the array element, its index, and the containing array.
Nevertheless, it's very useful to provide a callback that only uses the first parameter:

您可能想知道为什么我们允许像示例 y = x 中那样“丢弃”参数。允许这种赋值的原因是，在 JavaScript 中忽略额外的函数参数实际上是相当普遍的。例如，Array # foreach 为回调函数提供三个参数: 数组元素、其索引和包含数组。然而，提供一个只使用第一个参数的回调是非常有用的:

```ts
let items = [1, 2, 3];

// Don't force these extra parameters
items.forEach((item, index, array) => console.log(item));

// Should be OK!
items.forEach((item) => console.log(item));
```

Now let's look at how return types are treated, using two functions that differ only by their return type:

现在让我们来看看返回类型是如何处理的，使用两个只有返回类型不同的函数:

```ts
let x = () => ({ name: "Alice" });
let y = () => ({ name: "Alice", location: "Seattle" });

x = y; // OK
y = x; // Error, because x() lacks a location property
```

The type system enforces that the source function's return type be a subtype of the target type's return type.

类型系统强制源函数的返回类型为目标类型返回类型的子类型。

## Function Parameter Bivariance 函数参数双方差

When comparing the types of function parameters, assignment succeeds if either the source parameter is assignable to the target parameter, or vice versa.
This is unsound because a caller might end up being given a function that takes a more specialized type, but invokes the function with a less specialized type.
In practice, this sort of error is rare, and allowing this enables many common JavaScript patterns. A brief example:

在比较函数参数类型时，如果源参数可以分配给目标参数，或者反之亦然，则分配成功。这是不合理的，因为调用方可能最终得到一个接受更特殊类型的函数，但调用特殊类型较少的函数。实际上，这种类型的错误是很少见的，并且允许使用许多常见的 JavaScript 模式。一个简单的例子:

```ts
enum EventType {
  Mouse,
  Keyboard,
}

interface Event {
  timestamp: number;
}
interface MyMouseEvent extends Event {
  x: number;
  y: number;
}
interface MyKeyEvent extends Event {
  keyCode: number;
}

function listenEvent(eventType: EventType, handler: (n: Event) => void) {
  /* ... */
}

// Unsound, but useful and common
listenEvent(EventType.Mouse, (e: MyMouseEvent) => console.log(e.x + "," + e.y));

// Undesirable alternatives in presence of soundness
listenEvent(EventType.Mouse, (e: Event) =>
  console.log((e as MyMouseEvent).x + "," + (e as MyMouseEvent).y)
);
listenEvent(EventType.Mouse, ((e: MyMouseEvent) =>
  console.log(e.x + "," + e.y)) as (e: Event) => void);

// Still disallowed (clear error). Type safety enforced for wholly incompatible types
listenEvent(EventType.Mouse, (e: number) => console.log(e));
```

You can have TypeScript raise errors when this happens via the compiler flag [`strictFunctionTypes`](/tsconfig#strictFunctionTypes).

当这种情况通过编译器标志 [`strictFunctionTypes`](/tsconfig#strictFunctionTypes). 发生时，可以让 TypeScript 引发错误

## Optional Parameters and Rest Parameters 可选参数和剩余参数

When comparing functions for compatibility, optional and required parameters are interchangeable.
Extra optional parameters of the source type are not an error, and optional parameters of the target type without corresponding parameters in the source type are not an error.

在比较功能兼容性时，可选参数和所需参数是可互换的。

源类型的额外可选参数不是错误，源类型中没有对应参数的目标类型的可选参数不是错误。

When a function has a rest parameter, it is treated as if it were an infinite series of optional parameters.

当一个函数有一个 剩余参数时，它就被当作是一系列可选参数。

This is unsound from a type system perspective, but from a runtime point of view the idea of an optional parameter is generally not well-enforced since passing `undefined` in that position is equivalent for most functions.

从类型系统的角度来看，这是不合理的，但是从运行时的角度来看，可选参数的概念通常不能很好地执行，因为在该位置传递未定义的参数对于大多数函数是等效的。

The motivating example is the common pattern of a function that takes a callback and invokes it with some predictable (to the programmer) but unknown (to the type system) number of arguments:

激励的例子是一个函数的常见模式，它接受一个回调函数，然后用一些可预测的(对程序员来说)但是不知道(对类型系统来说)参数数量的参数来调用它:

```ts
function invokeLater(args: any[], callback: (...args: any[]) => void) {
  /* ... Invoke callback with 'args' ... */
}

// Unsound - invokeLater "might" provide any number of arguments
invokeLater([1, 2], (x, y) => console.log(x + ", " + y));

// Confusing (x and y are actually required) and undiscoverable
invokeLater([1, 2], (x?, y?) => console.log(x + ", " + y));
```

## Functions with overloads 带有重载的函数

When a function has overloads, each overload in the source type must be matched by a compatible signature on the target type.
This ensures that the target function can be called in all the same situations as the source function.

当函数有重载时，源类型中的每个重载都必须通过目标类型上的兼容签名进行匹配。这确保了在与源函数相同的所有情况下都可以调用目标函数。

## Enums 枚举

Enums are compatible with numbers, and numbers are compatible with enums. Enum values from different enum types are considered incompatible. For example,

枚举与数字兼容，数字与枚举兼容。不同枚举类型的枚举值被认为是不兼容的。比如说,

```ts
enum Status {
  Ready,
  Waiting,
}
enum Color {
  Red,
  Blue,
  Green,
}

let status = Status.Ready;
status = Color.Green; // Error
```

## Classes 类

Classes work similarly to object literal types and interfaces with one exception: they have both a static and an instance type.
When comparing two objects of a class type, only members of the instance are compared.
Static members and constructors do not affect compatibility.

类的工作方式与对象文本类型和接口类似，但有一个例外: 它们同时具有静态类型和实例类型。

比较类类型的两个对象时，只比较实例的成员。静态成员和构造函数不影响兼容性。

```ts
class Animal {
  feet: number;
  constructor(name: string, numFeet: number) {}
}

class Size {
  feet: number;
  constructor(numFeet: number) {}
}

let a: Animal;
let s: Size;

a = s; // OK
s = a; // OK
```

## Private and protected members in classes 类中的私有成员和保护成员

Private and protected members in a class affect their compatibility.
When an instance of a class is checked for compatibility, if the target type contains a private member, then the source type must also contain a private member that originated from the same class.
Likewise, the same applies for an instance with a protected member.
This allows a class to be assignment compatible with its super class, but _not_ with classes from a different inheritance hierarchy which otherwise have the same shape.

类中的私有成员和受保护成员影响其兼容性。当检查类的实例是否兼容时，如果目标类型包含私有成员，则源类型还必须包含来自同一类的私有成员。同样，这也适用于具有受保护成员的实例。这允许赋值与其超类兼容，但不允许赋值与来自不同继承层次结构的类兼容，否则它们具有相同的形状。

## Generics 泛型

Because TypeScript is a structural type system, type parameters only affect the resulting type when consumed as part of the type of a member. For example,

由于 TypeScript 是结构类型系统，类型参数只在作为成员类型的一部分使用时才会影响结果类型。比如说,

```ts
interface Empty<T> {}
let x: Empty<number>;
let y: Empty<string>;

x = y; // OK, because y matches structure of x
```

In the above, `x` and `y` are compatible because their structures do not use the type argument in a differentiating way.
Changing this example by adding a member to `Empty<T>` shows how this works:

在上面的例子中，`x` 和`y`是兼容的，因为它们的结构不使用类型参数进行微分。通过添加一个成员到 `Empty<T>` 来改变这个例子，可以看到这是如何工作的:

```ts
interface NotEmpty<T> {
  data: T;
}
let x: NotEmpty<number>;
let y: NotEmpty<string>;

x = y; // Error, because x and y are not compatible
```

In this way, a generic type that has its type arguments specified acts just like a non-generic type.

通过这种方式，具有指定的类型参数的泛型类型与非泛型类型类似。

For generic types that do not have their type arguments specified, compatibility is checked by specifying `any` in place of all unspecified type arguments.
The resulting types are then checked for compatibility, just as in the non-generic case.

对于没有指定其类型参数的泛型类型，可以通过指定所有未指定的类型参数的替代值来检查兼容性。然后检查结果类型的兼容性，就像在非泛型情况下一样。

For example, 比如

```ts
let identity = function <T>(x: T): T {
  // ...
};

let reverse = function <U>(y: U): U {
  // ...
};

identity = reverse; // OK, because (x: any) => any matches (y: any) => any
```

## Advanced Topics 高级话题

## Subtype vs Assignment 子类型与分配

So far, we've used "compatible", which is not a term defined in the language spec.
In TypeScript, there are two kinds of compatibility: subtype and assignment.
These differ only in that assignment extends subtype compatibility with rules to allow assignment to and from `any`, and to and from `enum` with corresponding numeric values.

到目前为止，我们使用了“ compatible”，这不是语言规范中定义的术语。在 TypeScript 中，有两种兼容性: 子类型和赋值。这些不同之处仅在于赋值扩展了子类型与规则的兼容性，允许赋值与任意子类型之间以及赋值与相应的数值与枚举之间的相互作用。

Different places in the language use one of the two compatibility mechanisms, depending on the situation.
For practical purposes, type compatibility is dictated by assignment compatibility, even in the cases of the `implements` and `extends` clauses.

语言中不同的地方使用两种兼容机制中的一种，这取决于具体情况。出于实用目的，类型兼容性取决于赋值兼容性，即使在 `implements` 和`extends`子句的情况下也是如此。

## `Any`, `unknown`, `object`, `void`, `undefined`, `null`, and `never` assignability

The following table summarizes assignability between some abstract types.
Rows indicate what each is assignable to, columns indicate what is assignable to them.
A "<span class='black-tick'>✓</span>" indicates a combination that is compatible only when [`strictNullChecks`](/tsconfig#strictNullChecks) is off.

下表总结了某些抽象类型之间的可分配性。行表示每个可分配的内容，列表示可分配给它们的内容。"<span class='black-tick'>✓</span>" 表示只有在严格校验结束时才能兼容的组合。

<!-- This is the rendered form of https://github.com/microsoft/TypeScript-Website/pull/1490 -->
<table class="data">
<thead>
<tr>
<th></th>
<th align="center">any</th>
<th align="center">unknown</th>
<th align="center">object</th>
<th align="center">void</th>
<th align="center">undefined</th>
<th align="center">null</th>
<th align="center">never</th>
</tr>
</thead>
<tbody>
<tr>
<td>any →</td>
<td align="center"></td>
<td align="center"><span class="blue-tick" style="
    color: #007aff;
">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="red-cross">✕</span></td>
</tr>
<tr>
<td>unknown →</td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"><span class="red-cross">✕</span></td>
</tr>
<tr>
<td>object →</td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"><span class="red-cross">✕</span></td>
</tr>
<tr>
<td>void →</td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"><span class="red-cross">✕</span></td>
</tr>
<tr>
<td>undefined →</td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="black-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"></td>
<td align="center"><span class="black-tick">✓</span></td>
<td align="center"><span class="red-cross">✕</span></td>
</tr>
<tr>
<td>null →</td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="black-tick">✓</span></td>
<td align="center"><span class="black-tick">✓</span></td>
<td align="center"><span class="black-tick">✓</span></td>
<td align="center"></td>
<td align="center"><span class="red-cross">✕</span></td>
</tr>
<tr>
<td>never →</td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"></td>
</tr>
</tbody>
</table>

Reiterating [The Basics](/handbook/2/basic-types.html):

- Everything is assignable to itself.任何东西都可以分配给它自己

- `any` and `unknown` are the same in terms of what is assignable to them, different in that `unknown` is not assignable to anything except `any`.

  `any`和`unknown`对于任何东西分配给她们表现是相同的，不同之处是 `unknown`不能分配给任何东西除了`any`

- `unknown` and `never` are like inverses of each other.
  Everything is assignable to `unknown`, `never` is assignable to everything.
  Nothing is assignable to `never`, `unknown` is not assignable to anything (except `any`).
  
  `unknown` 和`never` are 和其他是相反的.
  
  任何东西都可以分配给 `unknown`，`never` 可以分配给任何东西
  
  没有任何东西可以分配给`never`,`unknown` 不能分配给任何东西 (除了 `any`)
  
- `void` is not assignable to or from anything, with the following exceptions: `any`, `unknown`, `never`, `undefined`, and `null` (if [`strictNullChecks`](/tsconfig#strictNullChecks) is off, see table for details).

  

- When [`strictNullChecks`](/tsconfig#strictNullChecks) is off, `null` and `undefined` are similar to `never`: assignable to most types, most types are not assignable to them.
  They are assignable to each other.
  
  当[`strictNullChecks`](/tsconfig#strictNullChecks) 关闭,`null` 和`undefined` 贴近   `never`  :可分配大多数类型，大多数类型不能分配给他们
  
  她们可以互相分配
  
- When [`strictNullChecks`](/tsconfig#strictNullChecks) is on, `null` and `undefined` behave more like `void`: not assignable to or from anything, except for `any`, `unknown`, `never`, and `void` (`undefined` is always assignable to `void`).

  当 [`strictNullChecks`](/tsconfig#strictNullChecks) 开启，`null` and `undefined` 行为更像 `void`:不能分配到任何东西，除了`any`, `unknown`, `never`, and `void` 
