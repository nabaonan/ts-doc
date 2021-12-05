---
title: Indexed Access Types
layout: docs
permalink: /docs/handbook/2/indexed-access-types.html
oneline: "Using Type['a'] syntax to access a subset of a type."
---

We can use an _indexed access type_ to look up a specific property on another type:

我们可以使用一个索引访问类型来查找另一个类型上的特定属性:



```ts twoslash
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"];
//   ^?
```

The indexing type is itself a type, so we can use unions, `keyof`, or other types entirely:
索引类型本身是一种类型，因此我们可以使用联合、键或其他类型:


```ts twoslash
type Person = { age: number; name: string; alive: boolean };
// ---cut---
type I1 = Person["age" | "name"];
//   ^?

type I2 = Person[keyof Person];
//   ^?

type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName];
//   ^?
```

You'll even see an error if you try to index a property that doesn't exist:
如果你尝试索引一个不存在的属性，你甚至会看到一个错误:


```ts twoslash
// @errors: 2339
type Person = { age: number; name: string; alive: boolean };
// ---cut---
type I1 = Person["alve"];
```

Another example of indexing with an arbitrary type is using `number` to get the type of an array's elements.
We can combine this with `typeof` to conveniently capture the element type of an array literal:
使用任意类型进行索引的另一个示例是使用 number 来获取数组元素的类型。我们可以把它和 typeof 结合起来，方便地捕获数组文字的元素类型:



```ts twoslash
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];

type Person = typeof MyArray[number];
//   ^?
type Age = typeof MyArray[number]["age"];
//   ^?
// Or
type Age2 = Person["age"];
//   ^?
```

You can only use types when indexing, meaning you can't use a `const` to make a variable reference:
您只能在索引时使用类型，这意味着您不能使用 const 来进行变量引用:



```ts twoslash
// @errors: 2538 2749
type Person = { age: number; name: string; alive: boolean };
// ---cut---
const key = "age";
type Age = Person[key];
```

However, you can use a type alias for a similar style of refactor:
但是，你可以使用类似的类型别名进行重构:


```ts twoslash
type Person = { age: number; name: string; alive: boolean };
// ---cut---
type key = "age";
type Age = Person[key];
```
