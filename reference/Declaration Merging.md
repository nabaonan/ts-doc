---
title: Declaration Merging
layout: docs
permalink: /docs/handbook/declaration-merging.html
oneline: How merging namespaces and interfaces works
translatable: true
---

## Introduction

Some of the unique concepts in TypeScript describe the shape of JavaScript objects at the type level.
One example that is especially unique to TypeScript is the concept of 'declaration merging'.
Understanding this concept will give you an advantage when working with existing JavaScript.
It also opens the door to more advanced abstraction concepts.

打字稿中的一些独特概念在类型级描述了 JavaScript 对象的形状。对于打字稿来说，一个特别独特的例子是“声明合并”的概念。理解这个概念将使您在使用现有的 JavaScript 时具有优势。它也为更高级的抽象概念打开了大门。

For the purposes of this article, "declaration merging" means that the compiler merges two separate declarations declared with the same name into a single definition.
This merged definition has the features of both of the original declarations.
Any number of declarations can be merged; it's not limited to just two declarations.

就本文而言，“声明合并”意味着编译器将两个单独的声明合并为一个定义，声明的名称相同。这个合并定义具有两个原始声明的特征。任何数量的声明都可以合并; 它不仅限于两个声明。

## Basic Concepts 基本概念

In TypeScript, a declaration creates entities in at least one of three groups: namespace, type, or value.
Namespace-creating declarations create a namespace, which contains names that are accessed using a dotted notation.
Type-creating declarations do just that: they create a type that is visible with the declared shape and bound to the given name.
Lastly, value-creating declarations create values that are visible in the output JavaScript.

在 TypeScript 中，声明至少在三个组中的一个组中创建实体: 名称空间、类型或值。创建名称空间的声明创建一个名称空间，其中包含使用点符号访问的名称。类型创建声明就是这样做的: 它们创建一个类型，该类型使用声明的形状可见并绑定到给定的名称。最后，创建值声明创建的值在输出 JavaScript 中是可见的。

| Declaration Type    | Namespace | Type | Value |
| ------------------- | :-------: | :--: | :---: |
| Namespace 命名空间  |     X     |      |   X   |
| Class 类            |           |  X   |   X   |
| Enum 枚举           |           |  X   |   X   |
| Interface 接口      |           |  X   |       |
| Type Alias 类型别名 |           |  X   |       |
| Function 函数       |           |      |   X   |
| Variable 变量       |           |      |   X   |

Understanding what is created with each declaration will help you understand what is merged when you perform a declaration merge.

理解每个声明创建的内容将有助于您理解在执行声明合并时合并了什么内容。

## Merging Interfaces 合并接口

The simplest, and perhaps most common, type of declaration merging is interface merging.
At the most basic level, the merge mechanically joins the members of both declarations into a single interface with the same name.

最简单也许是最常见的声明合并类型是接口合并。在最基本的层次上，merge 机械地将两个声明的成员连接到同名的单个接口中。



```ts
interface Box {
  height: number;
  width: number;
}

interface Box {
  scale: number;
}

let box: Box = { height: 5, width: 6, scale: 10 };
```

Non-function members of the interfaces should be unique.
If they are not unique, they must be of the same type.
The compiler will issue an error if the interfaces both declare a non-function member of the same name, but of different types.

接口的非函数成员应该是唯一的。如果它们不是唯一的，它们必须是相同类型的。如果接口声明的非函数成员名称相同，但类型不同，则编译器将发出错误。

For function members, each function member of the same name is treated as describing an overload of the same function.
Of note, too, is that in the case of interface `A` merging with later interface `A`, the second interface will have a higher precedence than the first.

对于函数成员，同名的每个函数成员都被视为描述同一函数的重载。同样值得注意的是，在接口 a 与后面的接口 a 合并的情况下，第二个接口的优先级将高于第一个接口。

That is, in the example:

也就是说，在这个例子中:

```ts
interface Cloner {
  clone(animal: Animal): Animal;
}

interface Cloner {
  clone(animal: Sheep): Sheep;
}

interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
}
```

The three interfaces will merge to create a single declaration as so:

这三个接口将合并为一个声明，如下所示:

```ts
interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
  clone(animal: Sheep): Sheep;
  clone(animal: Animal): Animal;
}
```

Notice that the elements of each group maintains the same order, but the groups themselves are merged with later overload sets ordered first.

请注意，每个组的元素保持相同的顺序，但组本身首先与后来的重载集合合并。

One exception to this rule is specialized signatures.
If a signature has a parameter whose type is a _single_ string literal type (e.g. not a union of string literals), then it will be bubbled toward the top of its merged overload list.

这条规则的一个例外是专门化的签名。如果签名有一个参数，其类型是单个字符串文字类型(例如，不是字符串文字的联合) ，那么它将冒泡到合并重载列表的顶部。

For instance, the following interfaces will merge together:

例如，下列接口将合并在一起:

```ts
interface Document {
  createElement(tagName: any): Element;
}
interface Document {
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
}
interface Document {
  createElement(tagName: string): HTMLElement;
  createElement(tagName: "canvas"): HTMLCanvasElement;
}
```

The resulting merged declaration of `Document` will be the following:

由此产生的合并文件声明如下:

```ts
interface Document {
  createElement(tagName: "canvas"): HTMLCanvasElement;
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
  createElement(tagName: string): HTMLElement;
  createElement(tagName: any): Element;
}
```

## Merging Namespaces 合并名称空间

Similarly to interfaces, namespaces of the same name will also merge their members.
Since namespaces create both a namespace and a value, we need to understand how both merge.

与接口类似，具有相同名称的命名空间也将合并其成员。由于名称空间同时创建名称空间和值，因此我们需要了解两者如何合并。

To merge the namespaces, type definitions from exported interfaces declared in each namespace are themselves merged, forming a single namespace with merged interface definitions inside.

为了合并名称空间，将合并每个名称空间中声明的导出接口的类型定义，形成一个单一的名称空间，其中包含合并的接口定义。

To merge the namespace value, at each declaration site, if a namespace already exists with the given name, it is further extended by taking the existing namespace and adding the exported members of the second namespace to the first.

为了合并名称空间值，在每个声明站点上，如果名称空间已经与给定的名称空间一起存在，则通过接受现有名称空间并将导出的第二个名称空间的成员添加到第一个名称空间来进一步扩展名称空间。



The declaration merge of `Animals` in this example:

在这个例子中，动物的声明合并:

```ts
namespace Animals {
  export class Zebra {}
}

namespace Animals {
  export interface Legged {
    numberOfLegs: number;
  }
  export class Dog {}
}
```

is equivalent to:

相当于

```ts
namespace Animals {
  export interface Legged {
    numberOfLegs: number;
  }

  export class Zebra {}
  export class Dog {}
}
```

This model of namespace merging is a helpful starting place, but we also need to understand what happens with non-exported members.
Non-exported members are only visible in the original (un-merged) namespace. This means that after merging, merged members that came from other declarations cannot see non-exported members.

这种名称空间合并模型是一个很有帮助的起点，但是我们还需要了解对于未导出的成员会发生什么。非导出成员仅在原始(未合并)命名空间中可见。这意味着在合并之后，来自其他声明的合并成员不能看到非导出成员。

We can see this more clearly in this example:

我们可以在这个例子中更清楚地看到这一点:

```ts
namespace Animal {
  let haveMuscles = true;

  export function animalsHaveMuscles() {
    return haveMuscles;
  }
}

namespace Animal {
  export function doAnimalsHaveMuscles() {
    return haveMuscles; // Error, because haveMuscles is not accessible here
  }
}
```

Because `haveMuscles` is not exported, only the `animalsHaveMuscles` function that shares the same un-merged namespace can see the symbol.
The `doAnimalsHaveMuscles` function, even though it's part of the merged `Animal` namespace can not see this un-exported member.

因为 haveMuscles 不会被导出，所以只有共享相同未合并名称空间的 animalsHaveMuscles 函数才能看到该符号。doAnimalsHaveMuscles 函数，即使它是合并的 Animal 名称空间的一部分，也不能看到这个未导出的成员。

## Merging Namespaces with Classes, Functions, and Enums 将命名空间与类、函数和枚举合并

Namespaces are flexible enough to also merge with other types of declarations.
To do so, the namespace declaration must follow the declaration it will merge with. The resulting declaration has properties of both declaration types.
TypeScript uses this capability to model some of the patterns in JavaScript as well as other programming languages.

命名空间具有足够的灵活性，可以与其他类型的声明合并。为此，名称空间声明必须遵循它将与之合并的声明。结果声明具有两种声明类型的属性。使用这种能力对 JavaScript 以及其他编程语言中的一些模式进行建模。

## Merging Namespaces with Classes 将命名空间与类合并

This gives the user a way of describing inner classes.

这为用户提供了一种描述内部类的方法。

```ts
class Album {
  label: Album.AlbumLabel;
}
namespace Album {
  export class AlbumLabel {}
}
```

The visibility rules for merged members is the same as described in the [Merging Namespaces](./declaration-merging.html#merging-namespaces) section, so we must export the `AlbumLabel` class for the merged class to see it.
The end result is a class managed inside of another class.
You can also use namespaces to add more static members to an existing class.

合并成员的可见性规则与合并名称空间部分中描述的规则相同，因此我们必须导出 AlbumLabel 类以便合并后的类能够看到它。最终的结果是在另一个类中管理一个类。还可以使用命名空间向现有类添加更多的静态成员。

In addition to the pattern of inner classes, you may also be familiar with the JavaScript practice of creating a function and then extending the function further by adding properties onto the function.
TypeScript uses declaration merging to build up definitions like this in a type-safe way.

除了内部类的模式之外，您可能还熟悉 JavaScript 的实践，即创建一个函数，然后通过在函数中添加属性来进一步扩展函数。打字稿使用声明合并以类型安全的方式构建类似的定义。

```ts
function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix;
}

namespace buildLabel {
  export let suffix = "";
  export let prefix = "Hello, ";
}

console.log(buildLabel("Sam Smith"));
```

Similarly, namespaces can be used to extend enums with static members:

类似地，名称空间可以用于使用静态成员扩展 enums:



```ts
enum Color {
  red = 1,
  green = 2,
  blue = 4,
}

namespace Color {
  export function mixColor(colorName: string) {
    if (colorName == "yellow") {
      return Color.red + Color.green;
    } else if (colorName == "white") {
      return Color.red + Color.green + Color.blue;
    } else if (colorName == "magenta") {
      return Color.red + Color.blue;
    } else if (colorName == "cyan") {
      return Color.green + Color.blue;
    }
  }
}
```

## Disallowed Merges

Not all merges are allowed in TypeScript.
Currently, classes can not merge with other classes or with variables.
For information on mimicking class merging, see the [Mixins in TypeScript](/docs/handbook/mixins.html) section.

并不是所有的合并在打字稿中都被允许。目前，类不能与其他类或变量合并。有关模拟类合并的信息，请参阅打字稿部分中的 mixin。

## Module Augmentation 模块增强

Although JavaScript modules do not support merging, you can patch existing objects by importing and then updating them.
Let's look at a toy Observable example:

虽然 JavaScript 模块不支持合并，但是您可以通过导入和更新现有对象来修补它们。让我们来看一个玩具的例子:

```ts
// observable.ts
export class Observable<T> {
  // ... implementation left as an exercise for the reader ...
}

// map.ts
import { Observable } from "./observable";
Observable.prototype.map = function (f) {
  // ... another exercise for the reader
};
```

This works fine in TypeScript too, but the compiler doesn't know about `Observable.prototype.map`.
You can use module augmentation to tell the compiler about it:

这在打字稿中也可以很好地工作，但是编译器不知道 Observable.prototype.map。你可以使用模块增强来告诉编译器:

```ts
// observable.ts
export class Observable<T> {
  // ... implementation left as an exercise for the reader ...
}

// map.ts
import { Observable } from "./observable";
declare module "./observable" {
  interface Observable<T> {
    map<U>(f: (x: T) => U): Observable<U>;
  }
}
Observable.prototype.map = function (f) {
  // ... another exercise for the reader
};

// consumer.ts
import { Observable } from "./observable";
import "./map";
let o: Observable<number>;
o.map((x) => x.toFixed());
```

The module name is resolved the same way as module specifiers in `import`/`export`.
See [Modules](/docs/handbook/modules.html) for more information.
Then the declarations in an augmentation are merged as if they were declared in the same file as the original.

模块名称的解析方式与导入/导出中的模块说明符相同。有关更多信息，请参见模块。然后合并扩展中的声明，就好像它们在原始文件中声明一样。

However, there are two limitations to keep in mind:

然而，有两个限制要记住:

1. You can't declare new top-level declarations in the augmentation -- just patches to existing declarations.您不能在扩展中声明新的顶级声明——只能对现有声明进行补丁
2. Default exports also cannot be augmented, only named exports (since you need to augment an export by its exported name, and `default` is a reserved word - see [#14080](https://github.com/Microsoft/TypeScript/issues/14080) for details) 默认导出也不能增强，只能命名导出(因为需要通过导出的名称增强导出

## Global augmentation 全局增加

You can also add declarations to the global scope from inside a module:

您还可以从模块内部向全局范围添加声明:

```ts
// observable.ts
export class Observable<T> {
  // ... still no implementation ...
}

declare global {
  interface Array<T> {
    toObservable(): Observable<T>;
  }
}

Array.prototype.toObservable = function () {
  // ...
};
```

Global augmentations have the same behavior and limits as module augmentations.

全局扩展与模块扩展具有相同的行为和限制。
