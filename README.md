# Knight Arena

A simple random room generated roguelike game where you combine different weapons
with unique attack patterns against enemies.

Prove yourself worthy of being called a knight and see how far you can go!!!

## Game instructions
- `w`/`a`/`s`/`d` to walk and `v`/`b` to attack on desktop.
- Gamepad and atk buttons `a`/`b` for mobile. 
- Pick your starting weapon with `v`/`b` in the keyboard or press the buttons in mobile.
- `v`/`b` or `a`/`b` allows you to pick a weapons to that respective hand, it also allows you to open doors.
- Treasure room can only be opened if you have the key.
- Clicking in the top right speaker or pressing `m` can mute the game sounds.
- Enemies may drop their weapons after dead.

## Weapons in game

### Close Melee:
- Fist: down atk
- Shield: down-side atk, pushes enemies down
- Axe: down-side atk
- Morning Star: side atk
- Hammer: top-side atk
- Sword: top-side-down atk

### Long Range Melee:
- Spear: down atk
- Greatsword: 360 atk
- Halberd: top atk

### Range:
- Trowing Knives: down-side atk
- Trowing Axe: side atk
- Crossbow: top-side atk

## Enemy Behaviours
- Afraid: keeps himself at a distance from the player, if player gets close they run away.
- Agressive: follows the player and attacks.
- Defensive: gets close to player but keeps a distance to perform attacks.

## Contributing

### Installing Dependencies

After cloning this repo, install dependecies:

```
pnpm i
```

### Code format

```
pnpm check
```

### Testing the app in the browser

To test your work in your browser (with hot reloading!) while developing:

```
pnpm dev
# Alternatively to test in a more advanced WebXDC emulator:
pnpm start
```

### Building

To package the WebXDC file:

```
pnpm build
```

To package the WebXDC with developer tools inside to debug in Delta Chat, set the `NODE_ENV`
environment variable to "debug":

```
NODE_ENV=debug pnpm build
```

The resulting optimized `.xdc` file is saved in `dist-xdc/` folder.

### Releasing

To automatically build and create a new GitHub release with the `.xdc` file:

```
git tag v1.0.1
git push origin v1.0.1
```
