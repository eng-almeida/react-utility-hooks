import { useEffect } from 'react';

const SEPARATOR = '+';

const isMacintosh = () => navigator.platform.indexOf('Mac') > -1;
const getMetaKeyName = () => isMacintosh() ? 'cmd' : 'win';

type BindedKeysProps = {
  specialKeys: Array<string>;
  key: string | null;
}
/**
 *
 * @param keys String or array of strings with key combinations, separated by a '+'. Example: cmd+s or shift+a
 * @param onKeyMatched Callback fired when a key combination is pressed
 */
export const useHotKey = (
  keys: Array<string> | string,
  onKeyMatched: (key: string) => void
) => {
  const keysArr = Array.isArray(keys) ? keys : [keys];
  const bindedKeys = keysArr.map((key) =>
    key.split(SEPARATOR).reduce<BindedKeysProps>(
      (acc, currentKey) => {
        const { specialKeys, key } = acc;
        const isSpecialKey = currentKey.length > 1;
        return isSpecialKey ? {
          specialKeys: [...specialKeys, currentKey.toLowerCase()],
          key
        } : {
            specialKeys,
            key: currentKey.toLowerCase()
          }
      },
      { specialKeys: [], key: null }
    )
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      const { key: pressedKey, metaKey, ctrlKey, shiftKey, altKey } = event;
      const specialKeysState = [
        { name: getMetaKeyName(), pressed: Boolean(metaKey) },
        { name: 'ctrl', pressed: Boolean(ctrlKey) },
        { name: 'shift', pressed: Boolean(shiftKey) },
        { name: 'alt', pressed: Boolean(altKey) },
      ];

      for (let i = 0; i < bindedKeys.length; i++) {
        const { specialKeys, key } = bindedKeys[i];
        const specialKeysMatched = specialKeysState
          .filter(
            (value) =>
              value.pressed && specialKeys.includes(value.name)
          )
          .map((value) => value.name);
        const keyMatched = key === pressedKey.toLowerCase();
        // Only special keys pressed
        if (specialKeysMatched.length === specialKeys.length && !key) {
          onKeyMatched(specialKeysMatched.join(SEPARATOR));
          break;
        }
        // Only key pressed
        else if (specialKeys.length === 0 && keyMatched) {
          onKeyMatched(pressedKey);
          break;
        }
        // Combination of special keys with key
        else if (
          specialKeysMatched.length === specialKeys.length &&
          keyMatched
        ) {
          onKeyMatched(
            `${specialKeysMatched.join(SEPARATOR)}${SEPARATOR}${pressedKey}`
          );
          break;
        }

      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  });
};
