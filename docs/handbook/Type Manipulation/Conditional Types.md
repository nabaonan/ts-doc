---
title: Conditional Types
layout: docs
permalink: /docs/handbook/2/conditional-types.html
oneline: "Create types which act like if statements in the type system."
---

At the heart of most useful programs, we have to make decisions based on input.
JavaScript programs are no different, but given the fact that values can be easily introspected, those decisions are also based on the types of the inputs.
_Conditional types_ help describe the relation between the types of inputs and outputs.

在大多数有用的程序的核心，我们必须根据输入做出决定。程序没有什么不同，但是考虑到值可以很容易地反省，这些决定也是基于输入的类型。条件类型帮助描述输入和输出类型之间的关系。



```ts twoslash
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}

type Example1 = Dog extends Animal ? number : string;
//   ^?

type Example2 = RegExp extends Animal ? number : string;
//   ^?
```

Conditional types take a form that looks a little like conditional expressions (`condition ? trueExpression : falseExpression`) in JavaScript:
条件类型的形式看起来有点像 JavaScript 中的条件表达式(condition? trueExpression: falseExpression) :



```ts twoslash
type SomeType = any;
type OtherType = any;
type TrueType = any;
type FalseType = any;
type Stuff =
  // ---cut---
  SomeType extends OtherType ? TrueType : FalseType;
```

When the type on the left of the `extends` is assignable to the one on the right, then you'll get the type in the first branch (the "true" branch); otherwise you'll get the type in the latter branch (the "false" branch).
当 extends 左侧的类型可以分配给右侧的类型时，那么您将在第一个分支(“ true”分支)中获得类型; 否则您将在后一个分支(“ false”分支)中获得类型。



From the examples above, conditional types might not immediately seem useful - we can tell ourselves whether or not `Dog extends Animal` and pick `number` or `string`!
But the power of conditional types comes from using them with generics.
从上面的例子中，条件类型可能不会立即显得有用-我们可以告诉自己是否 Dog 扩展 Animal 并选择数字或字符串！但是，条件类型的强大功能来自与泛型一起使用它们。



For example, let's take the following `createLabel` function:
例如，我们来看看下面的 createLabel 函数:


```ts twoslash
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}

function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}
```

These overloads for createLabel describe a single JavaScript function that makes a choice based on the types of its inputs. Note a few things:

1. If a library has to make the same sort of choice over and over throughout its API, this becomes cumbersome.如果一个库不得不在其 API 中一遍又一遍地做出相同的选择，这就变得很麻烦
2. We have to create three overloads: one for each case when we're _sure_ of the type (one for `string` and one for `number`), and one for the most general case (taking a `string | number`). For every new type `createLabel` can handle, the number of overloads grows exponentially.

Instead, we can encode that logic in a conditional type:
相反，我们可以将逻辑编码为条件类型:


```ts twoslash
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}
// ---cut---
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
```

We can then use that conditional type to simplify our overloads down to a single function with no overloads.
然后，我们可以使用该条件类型将重载简化为单个函数，而不需要重载。



```ts twoslash
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
// ---cut---
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}

let a = createLabel("typescript");
//  ^?

let b = createLabel(2.8);
//  ^?

let c = createLabel(Math.random() ? "hello" : 42);
//  ^?
```

### Conditional Type Constraints

Often, the checks in a conditional type will provide us with some new information.
Just like with narrowing with type guards can give us a more specific type, the true branch of a conditional type will further constrain generics by the type we check against.
通常，条件类型中的检查将为我们提供一些新的信息。就像使用类型守卫进行窄化可以给我们提供更具体的类型一样，条件类型的真正分支将通过我们检查的类型进一步约束泛型。



For example, let's take the following:
例如，让我们来看看下面的例子:


```ts twoslash
// @errors: 2536
type MessageOf<T> = T["message"];
```

In this example, TypeScript errors because `T` isn't known to have a property called `message`.
We could constrain `T`, and TypeScript would no longer complain:
在本例中，由于 t 不知道有一个名为 message 的属性，所以会出现打字稿错误。我们可以限制 t，而且打字稿也不会再抱怨:



```ts twoslash
type MessageOf<T extends { message: unknown }> = T["message"];

interface Email {
  message: string;
}

type EmailMessageContents = MessageOf<Email>;
//   ^?
```

However, what if we wanted `MessageOf` to take any type, and default to something like `never` if a `message` property isn't available?
We can do this by moving the constraint out and introducing a conditional type:
但是，如果我们希望 MessageOf 采用任何类型，并且在消息属性不可用的情况下默认为 never，那么会怎样呢？我们可以通过移除约束并引入条件类型来实现:


```ts twoslash
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

interface Email {
  message: string;
}

interface Dog {
  bark(): void;
}

type EmailMessageContents = MessageOf<Email>;
//   ^?

type DogMessageContents = MessageOf<Dog>;
//   ^?
```

Within the true branch, TypeScript knows that `T` _will_ have a `message` property.
在真正的分支中，TypeScript 知道 t 将具有一个消息属性。


As another example, we could also write a type called `Flatten` that flattens array types to their element types, but leaves them alone otherwise:
作为另一个例子，我们也可以写一个类型叫 Flatten，它把数组类型平坦化为它们的元素类型，但是不使用其他类型:



```ts twoslash
type Flatten<T> = T extends any[] ? T[number] : T;

// Extracts out the element type.
type Str = Flatten<string[]>;
//   ^?

// Leaves the type alone.
type Num = Flatten<number>;
//   ^?
```

When `Flatten` is given an array type, it uses an indexed access with `number` to fetch out `string[]`'s element type.
Otherwise, it just returns the type it was given.
当 Flatten 给定一个数组类型时，它使用一个带有数字的索引访问来提取 string []的元素类型。否则，它只返回给定的类型。



### Inferring Within Conditional Types

We just found ourselves using conditional types to apply constraints and then extract out types.
This ends up being such a common operation that conditional types make it easier.
我们只是发现自己在使用条件类型来应用约束，然后提取出类型。这最终成为一种常见的操作，条件类型使其更容易。



Conditional types provide us with a way to infer from types we compare against in the true branch using the `infer` keyword.
For example, we could have inferred the element type in `Flatten` instead of fetching it out "manually" with an indexed access type:
条件类型为我们提供了一种使用 infer 关键字从真正分支中比较的类型推断出结果的方法。例如，我们可以在 Flatten 中推断元素类型，而不是使用索引访问类型“手动”获取它:



```ts twoslash
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
```

Here, we used the `infer` keyword to declaratively introduce a new generic type variable named `Item` instead of specifying how to retrieve the element type of `T` within the true branch.
This frees us from having to think about how to dig through and probing apart the structure of the types we're interested in.
在这里，我们使用 infer 关键字声明性地引入了一个新的泛型类型变量 Item，而不是指定如何在 true 分支中检索 t 的元素类型。这使我们不必去考虑如何挖掘和分析我们感兴趣的类型的结构。



We can write some useful helper type aliases using the `infer` keyword.
For example, for simple cases, we can extract the return type out from function types:
我们可以使用 infer 关键字编写一些有用的 helper 类型别名。例如，对于简单的情况，我们可以从函数类型中提取返回类型:


```ts twoslash
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;

type Num = GetReturnType<() => number>;
//   ^?

type Str = GetReturnType<(x: string) => string>;
//   ^?

type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;
//   ^?
```

When inferring from a type with multiple call signatures (such as the type of an overloaded function), inferences are made from the _last_ signature (which, presumably, is the most permissive catch-all case). It is not possible to perform overload resolution based on a list of argument types.
当从具有多个调用签名的类型(例如重载函数的类型)进行推断时，从最后一个签名进行推断(据推测，这是最宽松的捕捉所有情况)。不可能基于参数类型列表执行重载解析。



```ts twoslash
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;

type T1 = ReturnType<typeof stringOrNum>;
//   ^?
```

## Distributive Conditional Types

When conditional types act on a generic type, they become _distributive_ when given a union type.
For example, take the following:
当条件类型作用于泛型类型时，它们在给定联合类型时成为分配类型。例如，以下面的例子为例:


```ts twoslash
type ToArray<Type> = Type extends any ? Type[] : never;
```

If we plug a union type into `ToArray`, then the conditional type will be applied to each member of that union.
如果我们将联合类型插入 ToArray，那么条件类型将应用于该联合的每个成员。



```ts twoslash
type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>;
//   ^?
```

What happens here is that `StrArrOrNumArr ` distributes on:
这里发生的是 StrArrOrNumArr 分布在:


```ts twoslash
type StrArrOrNumArr =
  // ---cut---
  string | number;
```

and maps over each member type of the union, to what is effectively:
并且映射到工会的每一个成员类型，到什么是有效的:


```ts twoslash
type ToArray<Type> = Type extends any ? Type[] : never;
type StrArrOrNumArr =
  // ---cut---
  ToArray<string> | ToArray<number>;
```

which leaves us with:
所以我们只剩下:


```ts twoslash
type StrArrOrNumArr =
  // ---cut---
  string[] | number[];
```

Typically, distributivity is the desired behavior.
To avoid that behavior, you can surround each side of the `extends` keyword with square brackets.

```ts twoslash
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

// 'StrArrOrNumArr' is no longer a union.
type StrArrOrNumArr = ToArrayNonDist<string | number>;
//   ^?
```
