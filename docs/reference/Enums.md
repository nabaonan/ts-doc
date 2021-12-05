---
title: Enums
layout: docs
permalink: /docs/handbook/enums.html
oneline: How TypeScript enums work
handbook: "true"
---

Enums are one of the few features TypeScript has which is not a type-level extension of JavaScript.
Enums 是 TypeScript 的少数几个特性之一，它不是 JavaScript 的类型级扩展。

Enums allow a developer to define a set of named constants.
Using enums can make it easier to document intent, or create a set of distinct cases.
TypeScript provides both numeric and string-based enums.
枚举允许开发人员定义一组命名的常量。使用枚举可以更容易地记录意图，或者创建一组不同的案例。打字稿同时提供了数字和基于字符串的枚举。

## Numeric enums 数字枚举

We'll first start off with numeric enums, which are probably more familiar if you're coming from other languages.
An enum can be defined using the `enum` keyword.
我们首先从数字 enums 开始，如果你来自其他语言，它可能更为熟悉。枚举可以使用枚举关键字定义。

```ts twoslash
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}
```

Above, we have a numeric enum where `Up` is initialized with `1`.
All of the following members are auto-incremented from that point on.
In other words, `Direction.Up` has the value `1`, `Down` has `2`, `Left` has `3`, and `Right` has `4`.
上面，我们有一个数值枚举，其中 Up 初始化为1。以下所有成员都从该点开始自动递增。换句话说，Direction.Up 的值是1，Down 的值是2，Left 的值是3，Right 的值是4。

If we wanted, we could leave off the initializers entirely:
如果我们愿意，我们可以完全忽略初始化:
```ts twoslash
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
```

Here, `Up` would have the value `0`, `Down` would have `1`, etc.
This auto-incrementing behavior is useful for cases where we might not care about the member values themselves, but do care that each value is distinct from other values in the same enum.
这里，Up 的值是0，Down 的值是1，等等。这种自动递增行为对于我们可能不关心成员值本身，但是确实关心每个值与同一枚举中的其他值不同的情况非常有用。

Using an enum is simple: just access any member as a property off of the enum itself, and declare types using the name of the enum:
使用枚举非常简单: 只需将任何成员作为枚举本身的属性访问，并使用枚举的名称声明类型:

```ts twoslash
enum UserResponse {
  No = 0,
  Yes = 1,
}

function respond(recipient: string, message: UserResponse): void {
  // ...
}

respond("Princess Caroline", UserResponse.Yes);
```

Numeric enums can be mixed in [computed and constant members (see below)](#computed-and-constant-members).
The short story is, enums without initializers either need to be first, or have to come after numeric enums initialized with numeric constants or other constant enum members.
In other words, the following isn't allowed:
数值枚举可以混合使用[computed and constant members (见下文)](#computed-and-constant-members).。
简而言之，没有初始化的枚举要么需要放在第一位，要么必须放在用数字常量或其他常量枚举成员初始化的数字枚举之后。
换句话说，以下内容是不允许的:

```ts twoslash
// @errors: 1061
const getSomeValue = () => 23;
// ---cut---
enum E {
  A = getSomeValue(),
  B,
}
```

## String enums 字符串 枚举

String enums are a similar concept, but have some subtle [runtime differences](#enums-at-runtime) as documented below.
In a string enum, each member has to be constant-initialized with a string literal, or with another string enum member.
字符串枚举 是一个类似的概念，但是在运行时有一些细微的差别，如下文所述。在字符串枚举中，必须使用字符串文字或另一个字符串枚举成员对每个成员进行常量初始化。

```ts twoslash
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

While string enums don't have auto-incrementing behavior, string enums have the benefit that they "serialize" well.
In other words, if you were debugging and had to read the runtime value of a numeric enum, the value is often opaque - it doesn't convey any useful meaning on its own (though [reverse mapping](#reverse-mappings) can often help), string enums allow you to give a meaningful and readable value when your code runs, independent of the name of the enum member itself.
虽然字符串枚举不具有自动递增行为，但字符串枚举的好处是它们可以很好地“序列化”。
换句话说，如果您正在调试并且必须读取一个数值枚举的运行时值，那么该值通常是不透明的——它本身并不传达任何有用的意义(尽管[反向映射](#reverse-mappings)通常有帮助) ，字符串枚举允许您在代码运行时给出一个有意义且可读的值，与枚举成员本身的名称无关。

## Heterogeneous enums 混合枚举

Technically enums can be mixed with string and numeric members, but it's not clear why you would ever want to do so:
从技术上讲，enum 可以与字符串和数字成员混合使用，但不清楚为什么要这样做:

```ts twoslash
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = "YES",
}
```

Unless you're really trying to take advantage of JavaScript's runtime behavior in a clever way, it's advised that you don't do this.
除非你真的想聪明地利用 JavaScript 的运行时行为，否则建议你不要这样做。

## Computed and constant members 计算成员和常数成员

Each enum member has a value associated with it which can be either _constant_ or _computed_.
An enum member is considered constant if:
每个枚举成员都有一个与之关联的值，该值可以是常量，也可以是计算值。一个枚举成员被认为是常量，如果:

- It is the first member in the enum and it has no initializer, in which case it's assigned the value `0`: 它是枚举中的第一个成员，没有初始化式，在这种情况下，它被赋值为0:

  ```ts twoslash
  // E.X is constant:
  enum E {
    X,
  }
  ```

- It does not have an initializer and the preceding enum member was a _numeric_ constant.
  In this case the value of the current enum member will be the value of the preceding enum member plus one.  
  它没有初始值设定项，前面的枚举成员是一个数值常数。
  在这种情况下，当前枚举成员的值将是前一个枚举成员加一的值。

  ```ts twoslash
  // All enum members in 'E1' and 'E2' are constant.
  
  enum E1 {
    X,
    Y,
    Z,
  }
  
  enum E2 {
    A = 1,
    B,
    C,
  }
  ```

- The enum member is initialized with a constant enum expression.
  A constant enum expression is a subset of TypeScript expressions that can be fully evaluated at compile time.
  An expression is a constant enum expression if it is:
  使用常量枚举表达式初始化枚举成员。常量枚举表达式是可以在编译时完全计算的 TypeScript 表达式的子集。表达式是一个常量枚举表达式，如果它是:

  1. a literal enum expression (basically a string literal or a numeric literal) 一个文本枚举表达式(基本上是一个字符串或者一个数值文本)
  2. a reference to previously defined constant enum member (which can originate from a different enum) 对先前定义的常量枚举成员的引用(可以来自不同的枚举)
  3. a parenthesized constant enum expression 带括号的常量 枚举 表达式
  4. one of the `+`, `-`, `~` unary operators applied to constant enum expression 应用于常数枚举表达式的一元运算符之一
  5. `+`, `-`, `*`, `/`, `%`, `<<`, `>>`, `>>>`, `&`, `|`, `^` binary operators with constant enum expressions as operands 以常数枚举表达式作为操作数的二进制运算符

  It is a compile time error for constant enum expressions to be evaluated to `NaN` or `Infinity`. 对于要求值为 NaN 或 Infinity 的常量枚举表达式，这是一个编译时错误。

In all other cases enum member is considered computed. 在所有其他情况下，我们认为是计算成员。

```ts twoslash
enum FileAccess {
  // constant members
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  // computed member
  G = "123".length,
}
```

## Union enums and enum member types  联合枚举和枚举成员类型

There is a special subset of constant enum members that aren't calculated: literal enum members.
A literal enum member is a constant enum member with no initialized value, or with values that are initialized to
常量枚举成员中有一个特殊的子集是不计算的: 文字枚举成员。文字枚举成员是没有初始化值或具有初始化为的值的常数枚举成员

- any string literal (e.g. `"foo"`, `"bar`, `"baz"`) 任何字符串字面量
- any numeric literal (e.g. `1`, `100`) 任意数字字面量
- a unary minus applied to any numeric literal (e.g. `-1`, `-100`) 适用于任何数字字面量的一元减号

When all members in an enum have literal enum values, some special semantics come to play.
当枚举中的所有成员都具有文字枚举值时，就会出现一些特殊的语义。

The first is that enum members also become types as well!
For example, we can say that certain members can _only_ have the value of an enum member:
第一，枚举成员也成为类型！例如，我们可以说某些成员只能有枚举成员的值:

```ts twoslash
// @errors: 2322
enum ShapeKind {
  Circle,
  Square,
}

interface Circle {
  kind: ShapeKind.Circle;
  radius: number;
}

interface Square {
  kind: ShapeKind.Square;
  sideLength: number;
}

let c: Circle = {
  kind: ShapeKind.Square,
  radius: 100,
};
```

The other change is that enum types themselves effectively become a _union_ of each enum member.
With union enums, the type system is able to leverage the fact that it knows the exact set of values that exist in the enum itself.
Because of that, TypeScript can catch bugs where we might be comparing values incorrectly.
For example:
另一个变化是枚举类型本身有效地成为每个枚举成员的联合。使用 union 枚举，类型系统能够利用这样一个事实，即它知道枚举本身中存在的确切值集。正因为如此，TypeScript 可以在我们可能比较错误值的地方捕捉 bug。例如:

```ts twoslash
// @errors: 2367
enum E {
  Foo,
  Bar,
}

function f(x: E) {
  if (x !== E.Foo || x !== E.Bar) {
    //
  }
}
```

In that example, we first checked whether `x` was _not_ `E.Foo`.
If that check succeeds, then our `||` will short-circuit, and the body of the 'if' will run.
However, if the check didn't succeed, then `x` can _only_ be `E.Foo`, so it doesn't make sense to see whether it's equal to `E.Bar`.
在这个例子中，我们首先检查 x 是否不是 E.Foo。如果检查成功，那么我们的 | | 将会短路，并且“ If”的主体将会运行。然而，如果检查没有成功，那么 x 只能是 E.Foo，所以看它是否等于 E.Bar 是没有意义的。

## Enums at runtime 运行时的枚举

Enums are real objects that exist at runtime. 
枚举是在运行时存在的真实对象
For example, the following enum

```ts twoslash
enum E {
  X,
  Y,
  Z,
}
```

can actually be passed around to functions 
实际上可以传递给函数

```ts twoslash
enum E {
  X,
  Y,
  Z,
}

function f(obj: { X: number }) {
  return obj.X;
}

// Works, since 'E' has a property named 'X' which is a number.
f(E);
```

## Enums at compile time 编译时的枚举

Even though Enums are real objects that exist at runtime, the `keyof` keyword works differently than you might expect for typical objects. Instead, use `keyof typeof` to get a Type that represents all Enum keys as strings.
尽管 枚举 是运行时存在的真实对象，但是 `keyof`关键字 与典型对象的工作方式可能不同。相反，使用 `keyof typeof`获得一个 Type，该 Type 将所有枚举键表示为字符串。

```ts twoslash
enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG,
}

/**
 * This is equivalent to:
 * type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
 */
type LogLevelStrings = keyof typeof LogLevel;

function printImportant(key: LogLevelStrings, message: string) {
  const num = LogLevel[key];
  if (num <= LogLevel.WARN) {
    console.log("Log level key is:", key);
    console.log("Log level value is:", num);
    console.log("Log level message is:", message);
  }
}
printImportant("ERROR", "This is a message");
```

### Reverse mappings 反向映射

In addition to creating an object with property names for members, numeric enums members also get a _reverse mapping_ from enum values to enum names.
For example, in this example:
除了为成员创建具有属性名称的对象之外，数字枚举成员还可以从枚举值反向映射到枚举名称。例如，在这个例子中:

```ts twoslash
enum Enum {
  A,
}

let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```

TypeScript compiles this down to the following JavaScript:
将其编译成以下 JavaScript:


```ts twoslash
// @showEmit
enum Enum {
  A,
}

let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```

In this generated code, an enum is compiled into an object that stores both forward (`name` -> `value`) and reverse (`value` -> `name`) mappings.
References to other enum members are always emitted as property accesses and never inlined.
在这个生成的代码中，枚举被编译成一个对象，该对象同时存储正向(name-> value)和反向(value-> name)映射。对其他枚举成员的引用始终作为属性访问发出，并且从不内联。

Keep in mind that string enum members _do not_ get a reverse mapping generated at all.
请记住，字符串枚举成员根本不会得到反向映射。



### `const` enums 常量枚举

In most cases, enums are a perfectly valid solution.
However sometimes requirements are tighter.
To avoid paying the cost of extra generated code and additional indirection when accessing enum values, it's possible to use `const` enums.
Const enums are defined using the `const` modifier on our enums:
在大多数情况下，枚举是一个完全有效的解决方案。然而，有时需求更严格。为了避免在访问枚举值时支付额外生成代码和额外间接的成本，可以使用 const 枚举。常量变量的定义使用了枚举的常量修饰符:

```ts twoslash
const enum Enum {
  A = 1,
  B = A * 2,
}
```

Const enums can only use constant enum expressions and unlike regular enums they are completely removed during compilation.
Const enum members are inlined at use sites.
This is possible since const enums cannot have computed members.
常量 枚举只能使用常量枚举表达式，与正则枚举不同，它们在编译期间被完全删除。常量枚举成员内联在使用站点。这是可能的，因为 const 枚举不能有计算成员。

```ts twoslash
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

let directions = [
  Direction.Up,
  Direction.Down,
  Direction.Left,
  Direction.Right,
];
```

in generated code will become
在生成的代码将成为

```ts twoslash
// @showEmit
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

let directions = [
  Direction.Up,
  Direction.Down,
  Direction.Left,
  Direction.Right,
];
```

## Ambient enums 环境枚举

Ambient enums are used to describe the shape of already existing enum types.
环境枚举用于描述已存在枚举类型的形状。
```ts twoslash
declare enum Enum {
  A = 1,
  B,
  C = 2,
}
```

One important difference between ambient and non-ambient enums is that, in regular enums, members that don't have an initializer will be considered constant if its preceding enum member is considered constant.
In contrast, an ambient (and non-const) enum member that does not have initializer is _always_ considered computed.
环境枚举和非环境枚举之间的一个重要区别是，在常规枚举中，如果前一个枚举成员被认为是常量，那么没有初始化程序的成员将被认为是常量。相比之下，环境(和非常量)枚举成员不具有初始化器始终被认为是计算。

## Objects vs Enums  对象对比枚举

In modern TypeScript, you may not need an enum when an object with `as const` could suffice:
在现代TypeScript中，如果一个对象具有`as const` 就足够了，那么你可能不需要 枚举:

```ts twoslash
const enum EDirection {
  Up,
  Down,
  Left,
  Right,
}

const ODirection = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
} as const;

EDirection.Up;
//         ^?

ODirection.Up;
//         ^?

// Using the enum as a parameter
function walk(dir: EDirection) {}

// It requires an extra line to pull out the keys
type Direction = typeof ODirection[keyof typeof ODirection];
function run(dir: Direction) {}

walk(EDirection.Left);
run(ODirection.Right);
```

The biggest argument in favour of this format over TypeScript's `enum` is that it keeps your codebase aligned with the state of JavaScript, and [when/if](https://github.com/rbuckton/proposal-enum) enums are added to JavaScript then you can move to the additional syntax.
支持这种格式而不支持 TypeScript 的 enum 的最大理由是，它使代码库与 JavaScript 的状态保持一致，并且当/如果将枚举添加到 JavaScript 中，那么您就可以转移到附加语法。
