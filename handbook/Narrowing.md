---
title: Narrowing
layout: docs
permalink: /docs/handbook/2/narrowing.html
oneline: 'Understand how TypeScript uses JavaScript knowledge to reduce the amount of type syntax in your projects.'
---

Imagine we have a function called `padLeft`.
假设我们有一个名为 padLeft 的函数。

```ts twoslash
function padLeft(padding: number | string, input: string): string {
  throw new Error('Not implemented yet!');
}
```

If `padding` is a `number`, it will treat that as the number of spaces we want to prepend to `input`.
If `padding` is a `string`, it should just prepend `padding` to `input`.
Let's try to implement the logic for when `padLeft` is passed a `number` for `padding`.
如果`padding` 是一个`number`，那么它将把这个数字当作我们想要预置到`input`的空格数。如果`padding`是一个`string`，它应该只是预先`padding`到`input`。让我们尝试实现当 `padLeft` 传递一个`number`作为填充时的逻辑。

```ts twoslash
// @errors: 2365
function padLeft(padding: number | string, input: string) {
  return new Array(padding + 1).join(' ') + input;
}
```

Uh-oh, we're getting an error on `padding + 1`.
TypeScript is warning us that adding a `number` to a `number | string` might not give us what we want, and it's right.
In other words, we haven't explicitly checked if `padding` is a `number` first, nor are we handling the case where it's a `string`, so let's do exactly that.
啊哦，我们在 padding + 1 上得到一个错误。正在警告我们，向一个数字 | 字符串添加一个数字可能不会给我们想要的，这是正确的。换句话说，我们没有明确地检查填充是否是一个数字，也没有处理它是一个字符串的情况，所以让我们确切地这样做。

```ts twoslash
function padLeft(padding: number | string, input: string) {
  if (typeof padding === 'number') {
    return new Array(padding + 1).join(' ') + input;
  }
  return padding + input;
}
```

If this mostly looks like uninteresting JavaScript code, that's sort of the point.
Apart from the annotations we put in place, this TypeScript code looks like JavaScript.
The idea is that TypeScript's type system aims to make it as easy as possible to write typical JavaScript code without bending over backwards to get type safety.
如果这看起来像是无趣的 JavaScript 代码，这就是问题所在。除了我们放置的注释，这个 TypeScript 代码看起来像 JavaScript。的类型系统旨在让编写典型的 JavaScript 代码变得尽可能简单，而不用为了类型安全而拼命工作。

While it might not look like much, there's actually a lot going under the covers here.
Much like how TypeScript analyzes runtime values using static types, it overlays type analysis on JavaScript's runtime control flow constructs like `if/else`, conditional ternaries, loops, truthiness checks, etc., which can all affect those types.
虽然看起来不怎么样，但实际上这里有很多隐藏的东西。就像 TypeScript 如何使用静态类型分析运行时值一样，它将类型分析覆盖在 JavaScript 的运行时控制流结构上，比如 if/else、条件句、循环、 truthiness 检查等，这些都会影响这些类型。

Within our `if` check, TypeScript sees `typeof padding === "number"` and understands that as a special form of code called a _type guard_.
TypeScript follows possible paths of execution that our programs can take to analyze the most specific possible type of a value at a given position.
It looks at these special checks (called _type guards_) and assignments, and the process of refining types to more specific types than declared is called _narrowing_.
In many editors we can observe these types as they change, and we'll even do so in our examples.
<zh>
在我们的 if 检查中，TypeScript 看到 `typeof padding = = = “ number”`，并将其理解为一种称为类型保护的特殊形式的代码。打字稿遵循可能的执行路径，我们的程序可以采用这些路径来分析给定位置上某个值的最具体的可能类型。它查看这些特殊检查(称为类型保护)和赋值，将类型细化为比声明的更具体的类型的过程称为缩小。在许多编辑器中，我们可以在这些类型更改时观察它们，我们甚至会在示例中这样做。
</zh>

```ts twoslash
function padLeft(padding: number | string, input: string) {
  if (typeof padding === 'number') {
    return new Array(padding + 1).join(' ') + input;
    //               ^?
  }
  return padding + input;
  //     ^?
}
```

There are a couple of different constructs TypeScript understands for narrowing.
<zh>有几种不同的 TypeScript 结构可以用于收缩。</zh>

## `typeof` type guards <zh>类型保护</zh>

As we've seen, JavaScript supports a `typeof` operator which can give very basic information about the type of values we have at runtime.
TypeScript expects this to return a certain set of strings:
正如我们所看到的，JavaScript 支持一种类型的运算符，它可以给出运行时值类型的非常基本的信息。希望返回一组特定的字符串:

- `"string"`
- `"number"`
- `"bigint"`
- `"boolean"`
- `"symbol"`
- `"undefined"`
- `"object"`
- `"function"`

Like we saw with `padLeft`, this operator comes up pretty often in a number of JavaScript libraries, and TypeScript can understand it to narrow types in different branches.
正如我们在 padLeft 中看到的，这个操作符经常出现在许多 JavaScript 库中，TypeScript 可以理解它来缩小不同分支中的类型。

In TypeScript, checking against the value returned by `typeof` is a type guard.
Because TypeScript encodes how `typeof` operates on different values, it knows about some of its quirks in JavaScript.
For example, notice that in the list above, `typeof` doesn't return the string `null`.
Check out the following example:
在 TypeScript 中，根据 typeof 返回的值进行检查是一种类型保护。因为 TypeScript 编码 typeof 如何对不同的值进行操作，所以它知道 JavaScript 的一些怪异之处。例如，注意在上面的列表中，typeof 没有返回字符串 null。看看下面的例子:

```ts twoslash
// @errors: 2531
function printAll(strs: string | string[] | null) {
  if (typeof strs === 'object') {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === 'string') {
    console.log(strs);
  } else {
    // do nothing
  }
}
```

In the `printAll` function, we try to check if `strs` is an object to see if it's an array type (now might be a good time to reinforce that arrays are object types in JavaScript).
But it turns out that in JavaScript, `typeof null` is actually `"object"`!
This is one of those unfortunate accidents of history.
在 printAll 函数中，我们尝试检查 strs 是否是一个对象，以确定它是否是一个数组类型(现在可能是强调数组在 JavaScript 中是对象类型的好时机)。但事实证明，在 JavaScript 中，typeof null 实际上是“ object”！这是历史上不幸的事件之一。

Users with enough experience might not be surprised, but not everyone has run into this in JavaScript; luckily, TypeScript lets us know that `strs` was only narrowed down to `string[] | null` instead of just `string[]`.
有足够经验的用户可能不会感到惊讶，但并不是每个人都在 JavaScript 中遇到过这种情况; 幸运的是，TypeScript 让我们知道 strs 只限于 string [] | null，而不是 string []。

This might be a good segue into what we'll call "truthiness" checking.
这可能是一个很好的切入点，我们称之为“真实性”检查。

# Truthiness narrowing 真实性缩小

Truthiness might not be a word you'll find in the dictionary, but it's very much something you'll hear about in JavaScript.
Truthiness 可能不是你可以在字典里找到的词，但是你可以在 JavaScript 中听到这个词。

In JavaScript, we can use any expression in conditionals, `&&`s, `||`s, `if` statements, Boolean negations (`!`), and more.
As an example, `if` statements don't expect their condition to always have the type `boolean`.
在 JavaScript 中，我们可以在条件句、 & & s、 | | s、 if 语句、布尔否定(!)中使用任何表达式，以及更多。例如，如果语句不期望它们的条件总是具有 boolean 类型。

```ts twoslash
function getUsersOnlineMessage(numUsersOnline: number) {
  if (numUsersOnline) {
    return `There are ${numUsersOnline} online now!`;
  }
  return "Nobody's here. :(";
}
```

In JavaScript, constructs like `if` first "coerce" their conditions to `boolean`s to make sense of them, and then choose their branches depending on whether the result is `true` or `false`.
Values like
在 JavaScript 中，如果首先“强制”它们的条件来布尔值以便理解它们，然后根据结果是否为真来选择它们的分支。价值观如

- `0`
- `NaN`
- `""` (the empty string)
- `0n` (the `bigint` version of zero)
- `null`
- `undefined`

all coerce to `false`, and other values get coerced `true`.
You can always coerce values to `boolean`s by running them through the `Boolean` function, or by using the shorter double-Boolean negation. (The latter has the advantage that TypeScript infers a narrow literal boolean type `true`, while inferring the first as type `boolean`.)
所有的强迫都是虚假的，其他的价值观都是被强制为真的。你总是可以强制值为布尔值，方法是在布尔函数中运行它们，或者使用较短的双布尔否定。(后者的优点是，TypeScript 将一个窄的文字布尔类型推断为 true，而将前者推断为布尔类型。)

```ts twoslash
// both of these result in 'true'
Boolean('hello'); // type: boolean, value: true
!!'world'; // type: true,    value: true
```

It's fairly popular to leverage this behavior, especially for guarding against values like `null` or `undefined`.
As an example, let's try using it for our `printAll` function.
利用这种行为是相当流行的，尤其是为了防范 null 或未定义的值。作为一个例子，让我们尝试在 printAll 函数中使用它。

```ts twoslash
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === 'object') {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === 'string') {
    console.log(strs);
  }
}
```

You'll notice that we've gotten rid of the error above by checking if `strs` is truthy.
This at least prevents us from dreaded errors when we run our code like:
您会注意到，我们已经通过检查 strs 是否真实而消除了上面的错误。这至少可以防止我们在运行代码时出现可怕的错误，比如:

```txt
TypeError: null is not iterable
```

Keep in mind though that truthiness checking on primitives can often be error prone.
As an example, consider a different attempt at writing `printAll`
请记住，对原语的 truthiness 检查通常容易出错。作为一个例子，考虑一个不同的尝试编写 printAll

```ts twoslash {class: "do-not-do-this"}
function printAll(strs: string | string[] | null) {
  // !!!!!!!!!!!!!!!!
  //  DON'T DO THIS!
  //   KEEP READING
  // !!!!!!!!!!!!!!!!
  if (strs) {
    if (typeof strs === 'object') {
      for (const s of strs) {
        console.log(s);
      }
    } else if (typeof strs === 'string') {
      console.log(strs);
    }
  }
}
```

We wrapped the entire body of the function in a truthy check, but this has a subtle downside: we may no longer be handling the empty string case correctly.
我们将整个函数包装在一个真实的检查中，但这有一个微妙的缺点: 我们可能不再正确地处理空字符串大小写。

TypeScript doesn't hurt us here at all, but this is behavior worth noting if you're less familiar with JavaScript.
TypeScript can often help you catch bugs early on, but if you choose to do _nothing_ with a value, there's only so much that it can do without being overly prescriptive.
If you want, you can make sure you handle situations like these with a linter.
不会对我们造成任何伤害，但是如果你对 JavaScript 不是很熟悉的话，这种行为是值得注意的。通常可以帮助你在早期就发现 bug，但是如果你选择对值什么都不做，那么它就只能做这么多，而不需要过多的规定。如果你愿意，你可以确保你处理这样的情况与一个链接。

One last word on narrowing by truthiness is that Boolean negations with `!` filter out from negated branches.
关于 truthiness 收缩的最后一个词是，带! 的布尔否定从否定分支中过滤出来。

```ts twoslash
function multiplyAll(
  values: number[] | undefined,
  factor: number
): number[] | undefined {
  if (!values) {
    return values;
  } else {
    return values.map((x) => x * factor);
  }
}
```

## Equality narrowing 等号缩小

TypeScript also uses `switch` statements and equality checks like `===`, `!==`, `==`, and `!=` to narrow types.
For example:
还使用 switch 语句和相等性检查，比如 = = = 、 ! = = 、 = = 和! = 来缩小类型:(2)

```ts twoslash
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // We can now call any 'string' method on 'x' or 'y'.
    x.toUpperCase();
    // ^?
    y.toLowerCase();
    // ^?
  } else {
    console.log(x);
    //          ^?
    console.log(y);
    //          ^?
  }
}
```

When we checked that `x` and `y` are both equal in the above example, TypeScript knew their types also had to be equal.
Since `string` is the only common type that both `x` and `y` could take on, TypeScript knows that `x` and `y` must be a `string` in the first branch.
当我们在上面的例子中检查 x 和 y 都相等时，TypeScript 知道它们的类型也必须相等。因为字符串是 x 和 y 都可以接受的唯一通用类型，所以 TypeScript 知道 x 和 y 必须是第一个分支中的字符串。(2)

Checking against specific literal values (as opposed to variables) works also.
In our section about truthiness narrowing, we wrote a `printAll` function which was error-prone because it accidentally didn't handle empty strings properly.
Instead we could have done a specific check to block out `null`s, and TypeScript still correctly removes `null` from the type of `strs`.
检查特定的文字值(相对于变量)也可以工作。在我们关于 truthiness 收缩的部分中，我们编写了一个 printAll 函数，这个函数很容易出错，因为它不小心没有正确处理空字符串。相反，我们可以做一个特定的检查来阻止 null，而 TypeScript 仍然可以正确地从 strs 类型中删除 null。

```ts twoslash
function printAll(strs: string | string[] | null) {
  if (strs !== null) {
    if (typeof strs === 'object') {
      for (const s of strs) {
        //            ^?
        console.log(s);
      }
    } else if (typeof strs === 'string') {
      console.log(strs);
      //          ^?
    }
  }
}
```

JavaScript's looser equality checks with `==` and `!=` also get narrowed correctly.
If you're unfamiliar, checking whether something `== null` actually not only checks whether it is specifically the value `null` - it also checks whether it's potentially `undefined`.
The same applies to `== undefined`: it checks whether a value is either `null` or `undefined`.
JavaScript 的宽松的相等性检查对象是 = = 和！= 也正确地缩小范围。如果您不熟悉，检查某个值是否 = = null 实际上不仅检查它是否特定为 null 值，还检查它是否可能 undefined。这同样适用于 = = undefined: 它检查一个值是 null 还是 undefined。(2)

```ts twoslash
interface Container {
  value: number | null | undefined;
}

function multiplyValue(container: Container, factor: number) {
  // Remove both 'null' and 'undefined' from the type.
  if (container.value != null) {
    console.log(container.value);
    //                    ^?

    // Now we can safely multiply 'container.value'.
    container.value *= factor;
  }
}
```

## The `in` operator narrowing 运算符缩小

JavaScript has an operator for determining if an object has a property with a name: the `in` operator.
TypeScript takes this into account as a way to narrow down potential types.
JavaScript 有一个运算符用于确定一个对象是否有一个带名称的属性: in 运算符。考虑到了这一点，将其作为一种缩小潜在类型的方法。

For example, with the code: `"value" in x`. where `"value"` is a string literal and `x` is a union type.
The "true" branch narrows `x`'s types which have either an optional or required property `value`, and the "false" branch narrows to types which have an optional or missing property `value`.
例如，使用 x 中的代码: “ value”，其中“ value”是一个字符串文字，而 x 是一个联合类型。“ true”分支缩小了具有可选或必需属性值的 x 类型，而“ false”分支缩小到具有可选或缺少属性值的类型。(2)

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    return animal.swim();
  }

  return animal.fly();
}
```

To reiterate optional properties will exist in both sides for narrowing, for example a human could both swim and fly (with the right equipment) and thus should show up in both sides of the `in` check:
重申一下，两边都有缩小范围的可选属性，例如，一个人可以游泳和飞行(使用合适的设备) ，因此应该出现在检查区的两边:

<!-- prettier-ignore -->
```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
type Human = { swim?: () => void; fly?: () => void };

function move(animal: Fish | Bird | Human) {
  if ("swim" in animal) {
    animal;
//  ^?
  } else {
    animal;
//  ^?
  }
}
```

## `instanceof` narrowing

JavaScript has an operator for checking whether or not a value is an "instance" of another value.
More specifically, in JavaScript `x instanceof Foo` checks whether the _prototype chain_ of `x` contains `Foo.prototype`.
While we won't dive deep here, and you'll see more of this when we get into classes, they can still be useful for most values that can be constructed with `new`.
As you might have guessed, `instanceof` is also a type guard, and TypeScript narrows in branches guarded by `instanceof`s.
JavaScript 有一个运算符用于检查一个值是否是另一个值的“实例”。更具体地说，在 JavaScript x instanceof Foo 中检查 x 的原型链是否包含 Foo.prototype。虽然我们在这里不会深入讨论，当我们进入类的时候你会看到更多这样的内容，但是对于大多数可以用 new 构造的值来说，它们仍然是有用的。正如你可能已经猜到的，instanceof 也是一个类型保护器，并且打字稿在 instanceofs 保护的分支中变窄。

```ts twoslash
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString());
    //          ^?
  } else {
    console.log(x.toUpperCase());
    //          ^?
  }
}
```

## Assignments 分配

As we mentioned earlier, when we assign to any variable, TypeScript looks at the right side of the assignment and narrows the left side appropriately.
正如我们前面提到的，当我们分配任何变量时，TypeScript 会查看分配的右侧，并适当地缩小左侧。

```ts twoslash
let x = Math.random() < 0.5 ? 10 : 'hello world!';
//  ^?
x = 1;

console.log(x);
//          ^?
x = 'goodbye!';

console.log(x);
//          ^?
```

Notice that each of these assignments is valid.
Even though the observed type of `x` changed to `number` after our first assignment, we were still able to assign a `string` to `x`.
This is because the _declared type_ of `x` - the type that `x` started with - is `string | number`, and assignability is always checked against the declared type.
请注意，这些分配都是有效的。尽管在第一次赋值后观察到的 x 类型改变为 number，但我们仍然能够将字符串赋值给 x。这是因为 x 的声明类型—— x 开头的类型——是字符串 | 号，并且始终根据声明的类型检查可分配性。(2)

If we'd assigned a `boolean` to `x`, we'd have seen an error since that wasn't part of the declared type.
如果我们将一个布尔值赋给 x，我们会看到一个错误，因为它不是声明类型的一部分。

```ts twoslash
// @errors: 2322
let x = Math.random() < 0.5 ? 10 : 'hello world!';
//  ^?
x = 1;

console.log(x);
//          ^?
x = true;

console.log(x);
//          ^?
```

## Control flow analysis 控制流分析

Up until this point, we've gone through some basic examples of how TypeScript narrows within specific branches.
But there's a bit more going on than just walking up from every variable and looking for type guards in `if`s, `while`s, conditionals, etc.
For example
到目前为止，我们已经通过了一些基本的例子来说明打字稿在特定的分支中是如何变窄的。但是，除了从每个变量中寻找类型守卫(ifs、 whiles、 conditionals 等等)之外，还有更多的工作要做。例如

```ts twoslash
function padLeft(padding: number | string, input: string) {
  if (typeof padding === 'number') {
    return new Array(padding + 1).join(' ') + input;
  }
  return padding + input;
}
```

`padLeft` returns from within its first `if` block.
TypeScript was able to analyze this code and see that the rest of the body (`return padding + input;`) is _unreachable_ in the case where `padding` is a `number`.
As a result, it was able to remove `number` from the type of `padding` (narrowing from `string | number` to `string`) for the rest of the function.
padLeft 从它的第一个 if 块返回。TypeScript 能够分析这段代码，并发现在填充是一个数字的情况下，主体的其余部分(返回 padding + input;)是不可达的。因此，它能够从函数其余部分的填充类型(从字符串 | 数字缩小到字符串)中删除数字。

This analysis of code based on reachability is called _control flow analysis_, and TypeScript uses this flow analysis to narrow types as it encounters type guards and assignments.
When a variable is analyzed, control flow can split off and re-merge over and over again, and that variable can be observed to have a different type at each point.
这种基于可达性的代码分析称为控制流分析，当遇到类型保护和赋值时，TypeScript 使用这种流分析来缩小类型。当分析一个变量时，控制流可以一次又一次地分离和重新合并，并且可以观察到该变量在每个点具有不同的类型。

```ts twoslash
function example() {
  let x: string | number | boolean;

  x = Math.random() < 0.5;

  console.log(x);
  //          ^?

  if (Math.random() < 0.5) {
    x = 'hello';
    console.log(x);
    //          ^?
  } else {
    x = 100;
    console.log(x);
    //          ^?
  }

  return x;
  //     ^?
}
```

## Using type predicates 使用类型断言

We've worked with existing JavaScript constructs to handle narrowing so far, however sometimes you want more direct control over how types change throughout your code.
到目前为止，我们已经使用现有的 JavaScript 构造来处理收缩，但是有时候您希望更直接地控制整个代码中类型的变化。

To define a user-defined type guard, we simply need to define a function whose return type is a _type predicate_:
要定义一个用户定义的类型保护，我们只需要定义一个返回类型为类型断言的函数

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
declare function getSmallPet(): Fish | Bird;
// ---cut---
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

`pet is Fish` is our type predicate in this example.
A predicate takes the form `parameterName is Type`, where `parameterName` must be the name of a parameter from the current function signature.
`pet is Fish` 是本例中的类型断言。谓词接受表单 `参数名 作为类型 `，其中 参数名 必须是来自当前函数签名的参数的名称。

Any time `isFish` is called with some variable, TypeScript will _narrow_ that variable to that specific type if the original type is compatible.
任何时候都可以通过某个变量调用 isFish，如果原始类型兼容，则 TypeScript 会将该变量缩小到特定类型。

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
declare function getSmallPet(): Fish | Bird;
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
// ---cut---
// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet();

if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

Notice that TypeScript not only knows that `pet` is a `Fish` in the `if` branch;
it also knows that in the `else` branch, you _don't_ have a `Fish`, so you must have a `Bird`.
注意，TypeScript 不仅知道宠物是 if 分支中的一条鱼，它还知道在 else 分支中没有鱼，所以你必须有一只鸟.

You may use the type guard `isFish` to filter an array of `Fish | Bird` and obtain an array of `Fish`:
你可以使用类型保护 isFish 来过滤一组 Fish | Bird 并获得一组 Fish:

```ts twoslash
type Fish = { swim: () => void; name: string };
type Bird = { fly: () => void; name: string };
declare function getSmallPet(): Fish | Bird;
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
// ---cut---
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];
const underWater1: Fish[] = zoo.filter(isFish);
// or, equivalently
const underWater2: Fish[] = zoo.filter(isFish) as Fish[];

// The predicate may need repeating for more complex examples
const underWater3: Fish[] = zoo.filter((pet): pet is Fish => {
  if (pet.name === 'sharkey') return false;
  return isFish(pet);
});
```

In addition, classes can [use `this is Type`](/docs/handbook/2/classes.html#this-based-type-guards) to narrow their type.
此外，类可以使用 this is Type 来缩小它们的类型。

# Discriminated unions 区分联合类型

Most of the examples we've looked at so far have focused around narrowing single variables with simple types like `string`, `boolean`, and `number`.
While this is common, most of the time in JavaScript we'll be dealing with slightly more complex structures.
到目前为止，我们看到的大多数示例都集中在使用简单类型(如字符串、布尔值和数字)缩小单个变量。虽然这种情况很常见，但在 JavaScript 中，大多数时候我们将处理稍微复杂一些的结构。(2)

For some motivation, let's imagine we're trying to encode shapes like circles and squares.
Circles keep track of their radiuses and squares keep track of their side lengths.
We'll use a field called `kind` to tell which shape we're dealing with.
Here's a first attempt at defining `Shape`.
出于某种动机，让我们想象一下我们正在尝试编码像圆圈和方块这样的形状。圆圈记录它们的半径，方块记录它们的边长。我们将使用一个叫 kind 的字段来判断我们处理的是哪种形状。这是第一次尝试定义形状。

```ts twoslash
interface Shape {
  kind: 'circle' | 'square';
  radius?: number;
  sideLength?: number;
}
```

Notice we're using a union of string literal types: `"circle"` and `"square"` to tell us whether we should treat the shape as a circle or square respectively.
By using `"circle" | "square"` instead of `string`, we can avoid misspelling issues.
注意，我们使用字符串类型的联合: “圆”和“正方形”来告诉我们应该分别将形状视为圆还是正方形。通过使用“ circle”| “ square”代替字符串，我们可以避免拼写错误。

```ts twoslash
// @errors: 2367
interface Shape {
  kind: 'circle' | 'square';
  radius?: number;
  sideLength?: number;
}

// ---cut---
function handleShape(shape: Shape) {
  // oops!
  if (shape.kind === 'rect') {
    // ...
  }
}
```

We can write a `getArea` function that applies the right logic based on if it's dealing with a circle or square.
We'll first try dealing with circles.
我们可以编写一个 getArea 函数，根据它处理的是圆形还是正方形来应用正确的逻辑。我们先试着处理圆圈。

```ts twoslash
// @errors: 2532
interface Shape {
  kind: 'circle' | 'square';
  radius?: number;
  sideLength?: number;
}

// ---cut---
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
}
```

<!-- TODO -->

Under [`strictNullChecks`](/tsconfig#strictNullChecks) that gives us an error - which is appropriate since `radius` might not be defined.
But what if we perform the appropriate checks on the `kind` property?
在[`strictNullChecks`](/tsconfig#strictNullChecks)下，给我们一个错误，因为半径可能没有定义。但是，如果我们对类属性执行适当的检查会怎样呢？

```ts twoslash
// @errors: 2532
interface Shape {
  kind: 'circle' | 'square';
  radius?: number;
  sideLength?: number;
}

// ---cut---
function getArea(shape: Shape) {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius ** 2;
  }
}
```

Hmm, TypeScript still doesn't know what to do here.
We've hit a point where we know more about our values than the type checker does.
We could try to use a non-null assertion (a `!` after `shape.radius`) to say that `radius` is definitely present.
嗯，TypeScript 还是不知道该怎么做。我们遇到了这样一个问题: 我们比类型检查器更了解我们的值。我们可以尝试使用非空断言(a！在 shape.radius 之后)来说桡骨确实存在。

```ts twoslash
interface Shape {
  kind: 'circle' | 'square';
  radius?: number;
  sideLength?: number;
}

// ---cut---
function getArea(shape: Shape) {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius! ** 2;
  }
}
```

But this doesn't feel ideal.
We had to shout a bit at the type-checker with those non-null assertions (`!`) to convince it that `shape.radius` was defined, but those assertions are error-prone if we start to move code around.
Additionally, outside of [`strictNullChecks`](/tsconfig#strictNullChecks) we're able to accidentally access any of those fields anyway (since optional properties are just assumed to always be present when reading them).
We can definitely do better.
但这并不理想。我们必须对那些非空断言(!)的类型检查器喊一点来说服它 shape.radius 是定义好的，但是如果我们移动代码，这些断言就很容易出错。此外，在 strictNullChecks 之外，我们还可以偶尔访问这些字段中的任何一个(因为可选属性只是假定在读取它们时始终存在)。我们肯定可以做得更好。

The problem with this encoding of `Shape` is that the type-checker doesn't have any way to know whether or not `radius` or `sideLength` are present based on the `kind` property.
We need to communicate what _we_ know to the type checker.
With that in mind, let's take another swing at defining `Shape`.
这种 Shape 编码的问题在于，类型检查器无法根据种类属性知道是否存在半径或旁长。我们需要把我们所知道的告诉类型检查员。考虑到这一点，让我们再次定义 Shape。

```ts twoslash
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Square {
  kind: 'square';
  sideLength: number;
}

type Shape = Circle | Square;
```

Here, we've properly separated `Shape` out into two types with different values for the `kind` property, but `radius` and `sideLength` are declared as required properties in their respective types.
这里，我们正确地将 Shape 分成两种类型，它们对于 kind 属性有不同的值，但是 radius 和 sidength 在它们各自的类型中被声明为必需的属性。

Let's see what happens here when we try to access the `radius` of a `Shape`.
让我们看看当我们尝试访问一个 Shape 的半径时会发生什么。

```ts twoslash
// @errors: 2339
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Square {
  kind: 'square';
  sideLength: number;
}

type Shape = Circle | Square;

// ---cut---
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
}
```

Like with our first definition of `Shape`, this is still an error.
When `radius` was optional, we got an error (only in [`strictNullChecks`](/tsconfig#strictNullChecks)) because TypeScript couldn't tell whether the property was present.
Now that `Shape` is a union, TypeScript is telling us that `shape` might be a `Square`, and `Square`s don't have `radius` defined on them!
Both interpretations are correct, but only does our new encoding of `Shape` still cause an error outside of [`strictNullChecks`](/tsconfig#strictNullChecks).
就像我们对形状的第一个定义一样，这仍然是个错误。当 radius 是可选的时候，我们得到了一个错误(仅在 strictnullcheck 中) ，因为 TypeScript 无法判断属性是否存在。现在 Shape 是一个联合体，打字稿告诉我们形状可能是一个正方形，而正方形上没有定义半径！这两种解释都是正确的，但是只有我们对形状的新编码仍然会引起严格检查之外的错误。

But what if we tried checking the `kind` property again?
但是如果我们再次检查类属性呢？

```ts twoslash
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Square {
  kind: 'square';
  sideLength: number;
}

type Shape = Circle | Square;

// ---cut---
function getArea(shape: Shape) {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius ** 2;
    //               ^?
  }
}
```

That got rid of the error!
When every type in a union contains a common property with literal types, TypeScript considers that to be a _discriminated union_, and can narrow out the members of the union.
这样就消除了错误！当联合中的每个类型都包含具有文本类型的公共属性时，TypeScript 将其视为一个区分联合，并可以缩小联合的成员范围。

In this case, `kind` was that common property (which is what's considered a _discriminant_ property of `Shape`).
Checking whether the `kind` property was `"circle"` got rid of every type in `Shape` that didn't have a `kind` property with the type `"circle"`.
That narrowed `shape` down to the type `Circle`.
在这种情况下，kind 指的是公共属性(这被认为是 Shape 的判别属性)。检查 kind 属性是否为“ circle”，删除了 Shape 中没有 kind 属性的所有类型。将形状缩小到 Circle 类型。

The same checking works with `switch` statements as well.
Now we can try to write our complete `getArea` without any pesky `!` non-null assertions.
同样的检查也适用于 `switch` 语句。现在，我们可以尝试编写我们的完整的 `getArea` 没有任何麻烦的`!`非空断言。

```ts twoslash
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Square {
  kind: 'square';
  sideLength: number;
}

type Shape = Circle | Square;

// ---cut---
function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    //                 ^?
    case 'square':
      return shape.sideLength ** 2;
    //       ^?
  }
}
```

The important thing here was the encoding of `Shape`.
Communicating the right information to TypeScript - that `Circle` and `Square` were really two separate types with specific `kind` fields - was crucial.
Doing that let us write type-safe TypeScript code that looks no different than the JavaScript we would've written otherwise.
From there, the type system was able to do the "right" thing and figure out the types in each branch of our `switch` statement.
这里重要的是形状的编码。将正确的信息传达给打字脚本——圆形和方形实际上是两种带有特定类型字段的独立类型——至关重要。这样做可以让我们编写类型安全的 TypeScript 代码，它看起来与我们本来要编写的 JavaScript 没有什么不同。从那里，类型系统就能够做“正确”的事情，并在 switch 语句的每个分支中找出类型。

> As an aside, try playing around with the above example and remove some of the return keywords.
> You'll see that type-checking can help avoid bugs when accidentally falling through different clauses in a `switch` statement.

> 顺便说一句，尝试使用上面的例子并删除一些返回的关键字。
> 您将看到，类型检查可以帮助避免在不小心通过 switch 语句中的不同子句时出现 bug。

Discriminated unions are useful for more than just talking about circles and squares.
They're good for representing any sort of messaging scheme in JavaScript, like when sending messages over the network (client/server communication), or encoding mutations in a state management framework.
区分结合不仅仅是用来讨论圆形和方形的。它们非常适合用 JavaScript 表示任何类型的消息传递模式，比如通过网络发送消息(客户机/服务器通信) ，或者在状态管理框架中编码突变。

# The `never` type

When narrowing, you can reduce the options of a union to a point where you have removed all possibilities and have nothing left.
In those cases, TypeScript will use a `never` type to represent a state which shouldn't exist.
当缩小范围时，您可以将联合的选项减少到删除了所有的可能性并且没有剩余的选项。在这些情况下，TypeScript 将使用一个 never 类型来表示一个不应该存在的状态。

# Exhaustiveness checking

The `never` type is assignable to every type; however, no type is assignable to `never` (except `never` itself). This means you can use narrowing and rely on `never` turning up to do exhaustive checking in a switch statement.
Never 类型可以分配给每个类型; 然而，没有任何类型可以分配给 never (除了它本身)。这意味着您可以使用收缩，并依赖于在 switch 语句中从不进行详尽的检查。

For example, adding a `default` to our `getArea` function which tries to assign the shape to `never` will raise when every possible case has not been handled.
例如，在 getrea 函数中添加一个缺省值，该函数尝试将形状分配为 never，当所有可能的情况都没有处理时，将会引发。

```ts twoslash
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Square {
  kind: 'square';
  sideLength: number;
}
// ---cut---
type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

Adding a new member to the `Shape` union, will cause a TypeScript error:
向 Shape union 添加一个新成员，将导致 TypeScript 错误:

```ts twoslash
// @errors: 2322
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Square {
  kind: 'square';
  sideLength: number;
}
// ---cut---
interface Triangle {
  kind: 'triangle';
  sideLength: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```
