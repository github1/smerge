# @github1/smerge

[description]

[badges]

## Install
```bash
npm install @github1/smerge
```

## Usage
```javascript
smerge(source, target);
```

## Instructions
`$set`

Replaces the value in the owning key.
```javascript
smerge({
    a: 1,
    b: {b1: 'a'}
}, {
    a: 2,
    b: ['$set', {b2: 'a'}]
})
```
*Returns*
```javascript
{ a: 2, b: {b2: 'a'} }
```

`$push`

Adds an element to the equivalent array in the merged result.
```javascript
smerge({
    a: ['a']
}, {
    a: ['$push', 'b']
});
```
*Returns*
```javascript
{ a: ['a', 'b'] }
```

`$unshift`

Adds element to the equivalent array in the merged result.
```javascript
smerge({
    a: ['a']
}, {
    a: ['$unshift', 'b']
});
```
*Returns*
```javascript
{ a: ['b', 'a'] }
```

`$concat`

Concatenates an array onto the equivalent array in the merged result.
```javascript
smerge({
    a: ['a']
}, {
    a: ['$concat', ['b', 'c']]
});
```
*Returns*
```javascript
{ a: ['a', 'b', 'c'] }
````

`$function`

Executes the supplied function to determine how a value or values should be merged.
```javascript
smerge({
    a: ['a']
}, {
    a: ['$function', (a) => ({z: a})]
})
```
*Returns*
```javascript
{
    a: {z: ['a']}
}
```

## License
[license]
