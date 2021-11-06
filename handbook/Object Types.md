---
title: Object Types
layout: docs
permalink: /docs/handbook/2/objects.html
oneline: "How TypeScript describes the shapes of JavaScript objects."
---

In JavaScript, the fundamental way that we group and pass around data is through objects.
In TypeScript, we represent those through _object types_.

As we've seen, they can be anonymous:

在 JavaScript 中，我们分组和传递数据的基本方式是通过对象。

在TypeScript中，我们通过对象类型来表示这些内容。

正如我们所见，他们可以是匿名的:

```ts twoslash
function greet(person: { name: string; age: number }) {
  //                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  return "Hello " + person.name;
}
```

or they can be named by using either an interface

或者可以通过接口命名

```ts twoslash
interface Person {
  //      ^^^^^^
  name: string;
  age: number;
}

function greet(person: Person) {
  return "Hello " + person.name;
}
```

or a type alias.

或者是个类型

```ts twoslash
type Person = {
  // ^^^^^^
  name: string;
  age: number;
};

function greet(person: Person) {
  return "Hello " + person.name;
}
```

In all three examples above, we've written functions that take objects that contain the property `name` (which must be a `string`) and `age` (which must be a `number`).

在上面的三个示例中，我们已经编写了一些函数，它们接受包含属性名(必须是字符串)和年龄(必须是数字)的对象。

## Property Modifiers 属性修饰符

Each property in an object type can specify a couple of things: the type, whether the property is optional, and whether the property can be written to.

对象类型中的每个属性可以指定两个事项: 类型、属性是否可选以及是否可以将属性写入。

### Optional Properties 可选属性

Much of the time, we'll find ourselves dealing with objects that _might_ have a property set.
In those cases, we can mark those properties as _optional_ by adding a question mark (`?`) to the end of their names.

大多数时候，我们会发现自己处理的对象可能有一个属性集。在这些情况下，我们可以通过添加一个问号(`?`)将这些属性标记为可选的直到他们的名字结束。

```ts twoslash
interface Shape {}
declare function getShape(): Shape;

// ---cut---
interface PaintOptions {
  shape: Shape;
  xPos?: number;
  //  ^
  yPos?: number;
  //  ^
}

function paintShape(opts: PaintOptions) {
  // ...
}

const shape = getShape();
paintShape({ shape });
paintShape({ shape, xPos: 100 });
paintShape({ shape, yPos: 100 });
paintShape({ shape, xPos: 100, yPos: 100 });
```

In this example, both `xPos` and `yPos` are considered optional.
We can choose to provide either of them, so every call above to `paintShape` is valid.
All optionality really says is that if the property _is_ set, it better have a specific type.

大多数时候，我们会发现自己处理的对象可能有一个属性集。在这些情况下，我们可以通过添加一个问号(?)将这些属性标记为可选的直到他们的名字结束。

We can also read from those properties - but when we do under [`strictNullChecks`](/tsconfig#strictNullChecks), TypeScript will tell us they're potentially `undefined`.

我们也可以从这些属性中进行读取——但是当我们在 strictnullcheck 下读取时，TypeScript 会告诉我们它们可能是未定义的。

```ts twoslash
interface Shape {}
declare function getShape(): Shape;

interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}

// ---cut---
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos;
  //              ^?
  let yPos = opts.yPos;
  //              ^?
  // ...
}
```

In JavaScript, even if the property has never been set, we can still access it - it's just going to give us the value `undefined`.
We can just handle `undefined` specially.

在 JavaScript 中，即使属性从未被设置，我们仍然可以访问它——它只会给我们一个未定义的值。我们只能处理未定义的特殊问题。

```ts twoslash
interface Shape {}
declare function getShape(): Shape;

interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}

// ---cut---
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos === undefined ? 0 : opts.xPos;
  //  ^?
  let yPos = opts.yPos === undefined ? 0 : opts.yPos;
  //  ^?
  // ...
}
```

Note that this pattern of setting defaults for unspecified values is so common that JavaScript has syntax to support it.

请注意，这种为未指定值设置默认值的模式非常常见，以至于 JavaScript 有语法支持它。

```ts twoslash
interface Shape {}
declare function getShape(): Shape;

interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}

// ---cut---
function paintShape({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
  console.log("x coordinate at", xPos);
  //                             ^?
  console.log("y coordinate at", yPos);
  //                             ^?
  // ...
}
```

Here we used [a destructuring pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) for `paintShape`'s parameter, and provided [default values](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Default_values) for `xPos` and `yPos`.
Now `xPos` and `yPos` are both definitely present within the body of `paintShape`, but optional for any callers to `paintShape`.

在这里，我们为 paintShape 的参数使用了析构模式，并为 xPos 和 yPos 提供了默认值。现在，xPos 和 yPos 都肯定存在于 paintShape 的 body 中，但是对于任何调用 paintShape 的人来说都是可选的。

> Note that there is currently no way to place type annotations within destructuring patterns.
> This is because the following syntax already means something different in JavaScript.
>
> 请注意，目前没有将类型注释放置在析构化模式中的方法。这是因为下面的语法在 JavaScript 中已经有了不同的含义。

```ts twoslash
// @noImplicitAny: false
// @errors: 2552 2304
interface Shape {}
declare function render(x: unknown);
// ---cut---
function draw({ shape: Shape, xPos: number = 100 /*...*/ }) {
  render(shape);
  render(xPos);
}
```

In an object destructuring pattern, `shape: Shape` means "grab the property `shape` and redefine it locally as a variable named `Shape`.
Likewise `xPos: number` creates a variable named `number` whose value is based on the parameter's `xPos`.

在对象析构模式中，Shape: Shape 意味着“获取属性形状并在局部将其重新定义为名为 Shape 的变量。同样，xPos: number 创建一个名为 number 的变量，其值基于参数的 xPos。

Using [mapping modifiers](/docs/handbook/2/mapped-types.html#mapping-modifiers), you can remove `optional` attributes.

使用映射修饰符，您可以删除可选属性。

### `readonly` Properties

Properties can also be marked as `readonly` for TypeScript.
While it won't change any behavior at runtime, a property marked as `readonly` can't be written to during type-checking.

属性也可以标记为 TypeScript 的只读属性。虽然它不会在运行时改变任何行为，但是在类型检查期间不能写入标记为 readonly 的属性。

```ts twoslash
// @errors: 2540
interface SomeType {
  readonly prop: string;
}

function doSomething(obj: SomeType) {
  // We can read from 'obj.prop'.
  console.log(`prop has the value '${obj.prop}'.`);

  // But we can't re-assign it.
  obj.prop = "hello";
}
```

Using the `readonly` modifier doesn't necessarily imply that a value is totally immutable - or in other words, that its internal contents can't be changed.
It just means the property itself can't be re-written to.

使用 readonly 修饰符并不一定意味着一个值是完全不可变的，或者换句话说，它的内部内容不能被更改。这只是意味着财产本身不能被重写。

```ts twoslash
// @errors: 2540
interface Home {
  readonly resident: { name: string; age: number };
}

function visitForBirthday(home: Home) {
  // We can read and update properties from 'home.resident'.
  console.log(`Happy birthday ${home.resident.name}!`);
  home.resident.age++;
}

function evict(home: Home) {
  // But we can't write to the 'resident' property itself on a 'Home'.
  home.resident = {
    name: "Victor the Evictor",
    age: 42,
  };
}
```

It's important to manage expectations of what `readonly` implies.
It's useful to signal intent during development time for TypeScript on how an object should be used.
TypeScript doesn't factor in whether properties on two types are `readonly` when checking whether those types are compatible, so `readonly` properties can also change via aliasing.

管理 readonly 意味着什么的预期是很重要的。在开发打字脚本的过程中，向用户表明应该如何使用一个对象是非常有用的。在检查这两个类型是否兼容时，TypeScript 没有考虑这两个类型上的属性是否是只读的，因此只读属性也可以通过别名来改变。

```ts twoslash
interface Person {
  name: string;
  age: number;
}

interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}

let writablePerson: Person = {
  name: "Person McPersonface",
  age: 42,
};

// works
let readonlyPerson: ReadonlyPerson = writablePerson;

console.log(readonlyPerson.age); // prints '42'
writablePerson.age++;
console.log(readonlyPerson.age); // prints '43'
```

Using [mapping modifiers](/docs/handbook/2/mapped-types.html#mapping-modifiers), you can remove `readonly` attributes.

使用映射修饰符，您可以删除只读属性。

### Index Signatures 索引签名

Sometimes you don't know all the names of a type's properties ahead of time, but you do know the shape of the values.

有时候，您不能提前知道类型属性的所有名称，但是您知道值的形状。

In those cases you can use an index signature to describe the types of possible values, for example:

在这些情况下，你可以使用索引签名来描述可能的值的类型，例如:

```ts twoslash
declare function getStringArray(): StringArray;
// ---cut---
interface StringArray {
  [index: number]: string;
}

const myArray: StringArray = getStringArray();
const secondItem = myArray[1];
//     ^?
```

Above, we have a `StringArray` interface which has an index signature.
This index signature states that when a `StringArray` is indexed with a `number`, it will return a `string`.

上面，我们有一个 StringArray 接口，它有一个索引签名。这个索引签名声明当一个 StringArray 被一个数字索引时，它将返回一个字符串。

An index signature property type must be either 'string' or 'number'.

索引签名属性类型必须是“字符串”或“数字

<details>
    <summary>可以支持这两种类型的索引器..</summary>
    <p>It is possible to support both types of indexers, but the type returned from a numeric indexer must be a subtype of the type returned from the string indexer. This is because when indexing with a `number`, JavaScript will actually convert that to a `string` before indexing into an object. That means that indexing with `100` (a `number`) is the same thing as indexing with `"100"` (a `string`), so the two need to be consistent.</p>
  <p>
    可以支持这两种类型的索引器，但是从数值索引器返回的类型必须是从字符串索引器返回的类型的子类型。这是因为当使用数字作为索引时，JavaScript 实际上会在将数字作为索引对象之前将其转换为字符串。这意味着使用“100”(数字)作为索引与使用“100”(字符串)作为索引是一样的，因此两者需要保持一致。
  </p>


```ts twoslash
// @errors: 2413
// @strictPropertyInitialization: false
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Error: indexing with a numeric string might get you a completely separate type of Animal!
interface NotOkay {
  [x: number]: Animal;
  [x: string]: Dog;
}
```

</details>

While string index signatures are a powerful way to describe the "dictionary" pattern, they also enforce that all properties match their return type.
This is because a string index declares that `obj.property` is also available as `obj["property"]`.
In the following example, `name`'s type does not match the string index's type, and the type checker gives an error:

虽然字符串索引签名是描述“字典”模式的一种强大方式，但是它们也要求所有属性都匹配它们的返回类型。这是因为字符串索引声明 obj.property 也可以作为 obj [“ property”]使用。在下面的示例中，name 的类型与字符串索引的类型不匹配，并且类型检查器会给出一个错误:

```ts twoslash
// @errors: 2411
// @errors: 2411
interface NumberDictionary {
  [index: string]: number;

  length: number; // ok
  name: string;
}
```

However, properties of different types are acceptable if the index signature is a union of the property types:

但是，如果索引签名是属性类型的并集，则可以接受不同类型的属性:

```ts twoslash
interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number; // ok, length is a number
  name: string; // ok, name is a string
}
```

Finally, you can make index signatures `readonly` in order to prevent assignment to their indices:

最后，您可以使索引签名只读，以防止分配给他们的索引:

```ts twoslash
declare function getReadOnlyStringArray(): ReadonlyStringArray;
// ---cut---
// @errors: 2542
interface ReadonlyStringArray {
  readonly [index: number]: string;
}

let myArray: ReadonlyStringArray = getReadOnlyStringArray();
myArray[2] = "Mallory";
```

You can't set `myArray[2]` because the index signature is `readonly`.

## Extending Types扩展类型

It's pretty common to have types that might be more specific versions of other types.
For example, we might have a `BasicAddress` type that describes the fields necessary for sending letters and packages in the U.S.

有些类型可能是其他类型的特定版本，这种情况很常见。例如，我们可能有一个 BasicAddress 类型，它描述了在美国发送信件和包裹所必需的字段。

```ts twoslash
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
```

In some situations that's enough, but addresses often have a unit number associated with them if the building at an address has multiple units.
We can then describe an `AddressWithUnit`.

在某些情况下，这就足够了，但是如果一个地址的建筑物有多个单元，那么地址通常会有一个单元号。然后我们可以用 unit 来描述一个地址。

<!-- prettier-ignore -->
```ts twoslash
interface AddressWithUnit {
  name?: string;
  unit: string;
//^^^^^^^^^^^^^
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
```

This does the job, but the downside here is that we had to repeat all the other fields from `BasicAddress` when our changes were purely additive.
Instead, we can extend the original `BasicAddress` type and just add the new fields that are unique to `AddressWithUnit`.

这样就可以了，但是这里的缺点是我们必须重复 BasicAddress 中的所有其他字段，而我们的更改只是附加的。相反，我们可以扩展原来的 BasicAddress 类型，只需添加 AddressWithUnit 所特有的新字段。

```ts twoslash
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface AddressWithUnit extends BasicAddress {
  unit: string;
}
```

The `extends` keyword on an `interface` allows us to effectively copy members from other named types, and add whatever new members we want.
This can be useful for cutting down the amount of type declaration boilerplate we have to write, and for signaling intent that several different declarations of the same property might be related.
For example, `AddressWithUnit` didn't need to repeat the `street` property, and because `street` originates from `BasicAddress`, a reader will know that those two types are related in some way.

接口上的 extends 关键字允许我们有效地从其他命名类型中复制成员，并添加任何我们想要的新成员。这对于减少我们必须编写的类型声明样板的数量，以及发出意图，表明同一个属性的多个不同声明可能是相关的，非常有用。例如，AddressWithUnit 不需要重复 street 属性，而且因为 street 源于 BasicAddress，读者会知道这两种类型在某种程度上是相关的。

`interface`s can also extend from multiple types.

接口也可以从多种类型扩展。

```ts twoslash
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = {
  color: "red",
  radius: 42,
};
```

## Intersection Types交叉类型

`interface`s allowed us to build up new types from other types by extending them.
TypeScript provides another construct called _intersection types_ that is mainly used to combine existing object types.

接口允许我们通过扩展其他类型来构建新的类型。提供了另一种称为交集类型的构造，主要用于组合现有的对象类型。

An intersection type is defined using the `&` operator.

使用 & 运算符定义交集类型。

```ts twoslash
interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}

type ColorfulCircle = Colorful & Circle;
```

Here, we've intersected `Colorful` and `Circle` to produce a new type that has all the members of `Colorful` _and_ `Circle`.

在这里，我们将“五彩”和“圆”相结合，创造出一种新型的“五彩”和“圆”的所有成员。

```ts twoslash
// @errors: 2345
interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}
// ---cut---
function draw(circle: Colorful & Circle) {
  console.log(`Color was ${circle.color}`);
  console.log(`Radius was ${circle.radius}`);
}

// okay
draw({ color: "blue", radius: 42 });

// oops
draw({ color: "red", raidus: 42 });
```

## Interfaces vs. Intersections 接口和交叉点

We just looked at two ways to combine types which are similar, but are actually subtly different.
With interfaces, we could use an `extends` clause to extend from other types, and we were able to do something similar with intersections and name the result with a type alias.
The principle difference between the two is how conflicts are handled, and that difference is typically one of the main reasons why you'd pick one over the other between an interface and a type alias of an intersection type.

我们刚刚研究了两种组合类型的方法，这两种类型相似，但实际上略有不同。对于接口，我们可以使用 extends 子句从其他类型进行扩展，而且我们可以对交叉点进行类似的操作，并使用类型别名命名结果。两者之间的主要区别在于如何处理冲突，这种区别通常是在接口和交集类型的类型别名之间选择一个而不是另一个的主要原因之一。

<!--
For example, two types can declare the same property in an interface.

TODO -->

## Generic Object Types 泛型对象类型

Let's imagine a `Box` type that can contain any value - `string`s, `number`s, `Giraffe`s, whatever.

让我们假设 Box 类型可以包含任何值——字符串、数字、长颈鹿等等。

```ts twoslash
interface Box {
  contents: any;
}
```

Right now, the `contents` property is typed as `any`, which works, but can lead to accidents down the line.
现在，contents 属性被键入为 any，这是可行的，但是可能导致以后的事故。



We could instead use `unknown`, but that would mean that in cases where we already know the type of `contents`, we'd need to do precautionary checks, or use error-prone type assertions.
我们可以使用 unknown，但这意味着在我们已经知道内容类型的情况下，我们需要进行预防性检查，或者使用容易出错的类型断言。

```ts twoslash
interface Box {
  contents: unknown;
}

let x: Box = {
  contents: "hello world",
};

// we could check 'x.contents'
if (typeof x.contents === "string") {
  console.log(x.contents.toLowerCase());
}

// or we could use a type assertion
console.log((x.contents as string).toLowerCase());
```

One type safe approach would be to instead scaffold out different `Box` types for every type of `contents`.
一种类型安全的方法是为每种类型的内容分配不同的 Box 类型。



```ts twoslash
// @errors: 2322
interface NumberBox {
  contents: number;
}

interface StringBox {
  contents: string;
}

interface BooleanBox {
  contents: boolean;
}
```

But that means we'll have to create different functions, or overloads of functions, to operate on these types.
但这意味着我们必须创建不同的函数，或者重载函数，才能对这些类型进行操作。



```ts twoslash
interface NumberBox {
  contents: number;
}

interface StringBox {
  contents: string;
}

interface BooleanBox {
  contents: boolean;
}
// ---cut---
function setContents(box: StringBox, newContents: string): void;
function setContents(box: NumberBox, newContents: number): void;
function setContents(box: BooleanBox, newContents: boolean): void;
function setContents(box: { contents: any }, newContents: any) {
  box.contents = newContents;
}
```

That's a lot of boilerplate. Moreover, we might later need to introduce new types and overloads.
This is frustrating, since our box types and overloads are all effectively the same.
那是一大堆样板文件。此外，我们以后可能需要引入新的类型和重载。这是令人沮丧的，因为我们的盒子类型和重载实际上都是相同的。


Instead, we can make a _generic_ `Box` type which declares a _type parameter_.
相反，我们可以创建一个泛型 Box 类型，它声明一个类型参数。


```ts twoslash
interface Box<Type> {
  contents: Type;
}
```

You might read this as “A `Box` of `Type` is something whose `contents` have type `Type`”.
Later on, when we refer to `Box`, we have to give a _type argument_ in place of `Type`.
你可以这样理解“ a Box of Type 是一种内容具有 Type 类型的东西”。稍后，当我们引用 Box 时，我们必须给出一个类型参数来代替 Type。



```ts twoslash
interface Box<Type> {
  contents: Type;
}
// ---cut---
let box: Box<string>;
```

Think of `Box` as a template for a real type, where `Type` is a placeholder that will get replaced with some other type.
When TypeScript sees `Box<string>`, it will replace every instance of `Type` in `Box<Type>` with `string`, and end up working with something like `{ contents: string }`.
In other words, `Box<string>` and our earlier `StringBox` work identically.
可以将 Box 看作是一个实际类型的模板，其中 Type 是一个占位符，将被其他类型替换。当 TypeScript 看到 Box < string > 时，它将用 string 替换 Box < Type > 中的每个 Type 实例，并最终处理类似{ contents: string }的内容。换句话说，Box < string > 和我们早期的 StringBox 工作方式相同。

```ts twoslash
interface Box<Type> {
  contents: Type;
}
interface StringBox {
  contents: string;
}

let boxA: Box<string> = { contents: "hello" };
boxA.contents;
//   ^?

let boxB: StringBox = { contents: "world" };
boxB.contents;
//   ^?
```

`Box` is reusable in that `Type` can be substituted with anything. That means that when we need a box for a new type, we don't need to declare a new `Box` type at all (though we certainly could if we wanted to).
Box 是可重用的，因此类型可以被任何东西替代。这意味着当我们需要一个新类型的 Box 时，我们根本不需要声明一个新的 Box 类型(尽管如果我们想要的话，我们当然可以这样做)。

```ts twoslash
interface Box<Type> {
  contents: Type;
}

interface Apple {
  // ....
}

// Same as '{ contents: Apple }'.
type AppleBox = Box<Apple>;
```

This also means that we can avoid overloads entirely by instead using [generic functions](/docs/handbook/2/functions.html#generic-functions).
这也意味着我们可以完全通过使用泛型函数来避免重载。



```ts twoslash
interface Box<Type> {
  contents: Type;
}

// ---cut---
function setContents<Type>(box: Box<Type>, newContents: Type) {
  box.contents = newContents;
}
```

It is worth noting that type aliases can also be generic. We could have defined our new `Box<Type>` interface, which was:
值得注意的是，类型别名也可以是泛型的。我们可以定义新的 Box < type > 接口，它是:



```ts twoslash
interface Box<Type> {
  contents: Type;
}
```

by using a type alias instead:
通过使用一个类型别名:



```ts twoslash
type Box<Type> = {
  contents: Type;
};
```

Since type aliases, unlike interfaces, can describe more than just object types, we can also use them to write other kinds of generic helper types.
与接口不同，类型别名可以描述的不仅仅是对象类型，因此我们还可以使用它们来编写其他类型的通用帮助器类型。

```ts twoslash
// @errors: 2575
type OrNull<Type> = Type | null;

type OneOrMany<Type> = Type | Type[];

type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;
//   ^?

type OneOrManyOrNullStrings = OneOrManyOrNull<string>;
//   ^?
```

We'll circle back to type aliases in just a little bit.
稍后我们将回到别名类型。



### The `Array` Type

Generic object types are often some sort of container type that work independently of the type of elements they contain.
It's ideal for data structures to work this way so that they're re-usable across different data types.
泛型对象类型通常是某种独立于它们所包含的元素类型而工作的容器类型。数据结构以这种方式工作非常理想，这样它们就可以在不同的数据类型之间重用。


It turns out we've been working with a type just like that throughout this handbook: the `Array` type.
Whenever we write out types like `number[]` or `string[]`, that's really just a shorthand for `Array<number>` and `Array<string>`.
事实证明，我们在整个手册中都使用了类似的类型: Array 类型。每当我们写出 number []或 string []这样的类型时，它实际上只是 Array < number > 和 Array < string > 的简写。

```ts twoslash
function doSomething(value: Array<string>) {
  // ...
}

let myArray: string[] = ["hello", "world"];

// either of these work!
doSomething(myArray);
doSomething(new Array("hello", "world"));
```

Much like the `Box` type above, `Array` itself is a generic type.
与上面的 Box 类型非常相似，Array 本身也是一种泛型类型。

```ts twoslash
// @noLib: true
interface Number {}
interface String {}
interface Boolean {}
interface Symbol {}
// ---cut---
interface Array<Type> {
  /**
   * Gets or sets the length of the array.
   */
  length: number;

  /**
   * Removes the last element from an array and returns it.
   */
  pop(): Type | undefined;

  /**
   * Appends new elements to an array, and returns the new length of the array.
   */
  push(...items: Type[]): number;

  // ...
}
```

Modern JavaScript also provides other data structures which are generic, like `Map<K, V>`, `Set<T>`, and `Promise<T>`.
All this really means is that because of how `Map`, `Set`, and `Promise` behave, they can work with any sets of types.
现代 JavaScript 还提供了其他通用的数据结构，比如 Map < k，v > ，Set < t > ，Promise < t > 。所有这些实际上意味着，由于 Map、 Set 和 Promise 的行为方式，它们可以与任何类型的集合一起工作。

### The `ReadonlyArray` Type 

The `ReadonlyArray` is a special type that describes arrays that shouldn't be changed.
是一种特殊类型，用于描述不应该更改的数组。
```ts twoslash
// @errors: 2339
function doStuff(values: ReadonlyArray<string>) {
  // We can read from 'values'...
  const copy = values.slice();
  console.log(`The first value is ${values[0]}`);

  // ...but we can't mutate 'values'.
  values.push("hello!");
}
```

Much like the `readonly` modifier for properties, it's mainly a tool we can use for intent.
When we see a function that returns `ReadonlyArray`s, it tells us we're not meant to change the contents at all, and when we see a function that consumes `ReadonlyArray`s, it tells us that we can pass any array into that function without worrying that it will change its contents.
很像属性的 readonly 修饰符，它主要是一个我们可以用于意图的工具。当我们看到一个函数返回 ReadonlyArrays 时，它告诉我们，我们根本不打算改变内容，当我们看到一个函数使用 ReadonlyArrays 时，它告诉我们，我们可以将任何数组传递到该函数，而不用担心它会改变其内容。

Unlike `Array`, there isn't a `ReadonlyArray` constructor that we can use.
与 Array 不同，我们不能使用 ReadonlyArray 构造函数。



```ts twoslash
// @errors: 2693
new ReadonlyArray("red", "green", "blue");
```

Instead, we can assign regular `Array`s to `ReadonlyArray`s.
相反，我们可以将规则数组分配给 readonlyarray。


```ts twoslash
const roArray: ReadonlyArray<string> = ["red", "green", "blue"];
```

Just as TypeScript provides a shorthand syntax for `Array<Type>` with `Type[]`, it also provides a shorthand syntax for `ReadonlyArray<Type>` with `readonly Type[]`.
正如 TypeScript 为 Array < Type > 提供了一种简化语法，使用 Type [] ，它也为 ReadonlyArray < Type > 提供了一种简化语法，使用 readonly Type []。


```ts twoslash
// @errors: 2339
function doStuff(values: readonly string[]) {
  //                     ^^^^^^^^^^^^^^^^^
  // We can read from 'values'...
  const copy = values.slice();
  console.log(`The first value is ${values[0]}`);

  // ...but we can't mutate 'values'.
  values.push("hello!");
}
```

One last thing to note is that unlike the `readonly` property modifier, assignability isn't bidirectional between regular `Array`s and `ReadonlyArray`s.

```ts twoslash
// @errors: 4104
let x: readonly string[] = [];
let y: string[] = [];

x = y;
y = x;
```

### Tuple Types 元组类型

A _tuple type_ is another sort of `Array` type that knows exactly how many elements it contains, and exactly which types it contains at specific positions.
Tuple 类型是另一种 Array 类型，它确切地知道它包含多少个元素，以及它在特定位置包含哪些类型。

```ts twoslash
type StringNumberPair = [string, number];
//                      ^^^^^^^^^^^^^^^^
```

Here, `StringNumberPair` is a tuple type of `string` and `number`.
Like `ReadonlyArray`, it has no representation at runtime, but is significant to TypeScript.
To the type system, `StringNumberPair` describes arrays whose `0` index contains a `string` and whose `1` index contains a `number`.
在这里，StringNumberPair 是字符串和数字的元组类型。与 ReadonlyArray 一样，它在运行时没有表示，但对于打字稿非常重要。对于类型系统，StringNumberPair 描述其0索引包含字符串且其1索引包含数字的数组。

```ts twoslash
function doSomething(pair: [string, number]) {
  const a = pair[0];
  //    ^?
  const b = pair[1];
  //    ^?
  // ...
}

doSomething(["hello", 42]);
```

If we try to index past the number of elements, we'll get an error.
如果我们尝试索引过去的元素数量，我们会得到一个错误。


```ts twoslash
// @errors: 2493
function doSomething(pair: [string, number]) {
  // ...

  const c = pair[2];
}
```

We can also [destructure tuples](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring) using JavaScript's array destructuring.
我们也可以使用 JavaScript 的数组析构来重构元组。



```ts twoslash
function doSomething(stringHash: [string, number]) {
  const [inputString, hash] = stringHash;

  console.log(inputString);
  //          ^?

  console.log(hash);
  //          ^?
}
```

> Tuple types are useful in heavily convention-based APIs, where each element's meaning is "obvious".
> This gives us flexibility in whatever we want to name our variables when we destructure them.
> In the above example, we were able to name elements `0` and `1` to whatever we wanted.
>
> However, since not every user holds the same view of what's obvious, it may be worth reconsidering whether using objects with descriptive property names may be better for your API.
>元组类型在大量基于约定的 api 中非常有用，其中每个元素的意义都是“显而易见的”。这使得我们在解构变量时，可以灵活地为它们命名。在上面的示例中，我们可以将元素0和1命名为我们想要的名称。
>然而，由于不是每个用户都对显而易见的事物持有相同的观点，因此值得重新考虑使用具有描述性属性名称的对象是否对您的 API 更好。



Other than those length checks, simple tuple types like these are equivalent to types which are versions of `Array`s that declare properties for specific indexes, and that declare `length` with a numeric literal type.
除了这些长度检查之外，像这样的简单元组类型等价于为特定索引声明属性的数组版本的类型，以及用数值文本类型声明长度的类型。

```ts twoslash
interface StringNumberPair {
  // specialized properties
  length: 2;
  0: string;
  1: number;

  // Other 'Array<string | number>' members...
  slice(start?: number, end?: number): Array<string | number>;
}
```

Another thing you may be interested in is that tuples can have optional properties by writing out a question mark (`?` after an element's type).
Optional tuple elements can only come at the end, and also affect the type of `length`.
除了这些长度检查之外，像这样的简单元组类型等价于为特定索引声明属性的数组版本的类型，以及用数值文本类型声明长度的类型。

```ts twoslash
type Either2dOr3d = [number, number, number?];

function setCoordinate(coord: Either2dOr3d) {
  const [x, y, z] = coord;
  //           ^?

  console.log(`Provided coordinates had ${coord.length} dimensions`);
  //                                            ^?
}
```

Tuples can also have rest elements, which have to be an array/tuple type.
元组还可以有 rest 元素，这些元素必须是数组/元组类型。



```ts twoslash
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];
```

- `StringNumberBooleans` describes a tuple whose first two elements are `string` and `number` respectively, but which may have any number of `boolean`s following.
- `StringBooleansNumber` describes a tuple whose first element is `string` and then any number of `boolean`s and ending with a `number`.
- `BooleansStringNumber` describes a tuple whose starting elements any number of `boolean`s and ending with a `string` then a `number`.

A tuple with a rest element has no set "length" - it only has a set of well-known elements in different positions.
带有 rest 元素的 tuple 没有设置“长度”——它只有一组位于不同位置的已知元素。



```ts twoslash
type StringNumberBooleans = [string, number, ...boolean[]];
// ---cut---
const a: StringNumberBooleans = ["hello", 1];
const b: StringNumberBooleans = ["beautiful", 2, true];
const c: StringNumberBooleans = ["world", 3, true, false, true, false, true];
```

Why might optional and rest elements be useful?
Well, it allows TypeScript to correspond tuples with parameter lists.
Tuples types can be used in [rest parameters and arguments](/docs/handbook/2/functions.html#rest-parameters-and-arguments), so that the following:

为什么可选元素和 rest 元素可能有用？好吧，它允许打字稿与参数列表对应元组。可以在 rest 参数和参数中使用 tuple 类型，因此以下是:


```ts twoslash
function readButtonInput(...args: [string, number, ...boolean[]]) {
  const [name, version, ...input] = args;
  // ...
}
```

is basically equivalent to:
基本上等同于:

```ts twoslash
function readButtonInput(name: string, version: number, ...input: boolean[]) {
  // ...
}
```

This is handy when you want to take a variable number of arguments with a rest parameter, and you need a minimum number of elements, but you don't want to introduce intermediate variables.
当您希望使用带有 rest 参数的可变数量的参数，并且需要最少数量的元素，但又不希望引入中间变量时，这种方法非常方便。
<!--
TODO do we need this example?

For example, imagine we need to write a function that adds up `number`s based on arguments that get passed in.

```ts twoslash
function sum(...args: number[]) {
    // ...
}
```

We might feel like it makes little sense to take any fewer than 2 elements, so we want to require callers to provide at least 2 arguments.
A first attempt might be

```ts twoslash
function foo(a: number, b: number, ...args: number[]) {
    args.unshift(a, b);

    let result = 0;
    for (const value of args) {
        result += value;
    }
    return result;
}
```

-->

### `readonly` Tuple Types 只读元祖类型

One final note about tuple types - tuples types have `readonly` variants, and can be specified by sticking a `readonly` modifier in front of them - just like with array shorthand syntax.
关于元组类型的最后一个注意事项-元组类型有只读变量，可以通过在它们前面添加只读修饰符来指定-就像数组速记语法一样。


```ts twoslash
function doSomething(pair: readonly [string, number]) {
  //                       ^^^^^^^^^^^^^^^^^^^^^^^^^
  // ...
}
```

As you might expect, writing to any property of a `readonly` tuple isn't allowed in TypeScript.

```ts twoslash
// @errors: 2540
function doSomething(pair: readonly [string, number]) {
  pair[0] = "hello!";
}
```

Tuples tend to be created and left un-modified in most code, so annotating types as `readonly` tuples when possible is a good default.
This is also important given that array literals with `const` assertions will be inferred with `readonly` tuple types.
在大多数代码中，元组倾向于被创建并且不被修改，所以尽可能地将类型注释为只读元组是一个很好的缺省值。这一点也很重要，因为带有 const 断言的数组文字将使用只读元组类型进行推断。



```ts twoslash
// @errors: 2345
let point = [3, 4] as const;

function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}

distanceFromOrigin(point);
```

Here, `distanceFromOrigin` never modifies its elements, but expects a mutable tuple.
Since `point`'s type was inferred as `readonly [3, 4]`, it won't be compatible with `[number, number]` since that type can't guarantee `point`'s elements won't be mutated.
在这里，distanceFromOrigin 从不修改其元素，但是需要一个可变元组。由于 point 的类型被推断为只读[3,4] ，它不会与[ number，number ]兼容，因为这个类型不能保证 point 的元素不会发生变异。


<!-- ## Other Kinds of Object Members

Most of the declarations in object types:

### Method Syntax

### Call Signatures

### Construct Signatures

### Index Signatures -->
