import { Rocky   } from './Rocky.js';
import { Gas     } from './Gas.js';
import { Ice     } from './Ice.js';
import { Lava    } from './Lava.js';
import { Ocean   } from './Ocean.js';
import { Desert  } from './Desert.js';
import { Nebular } from './Nebular.js';
import { Storm   } from './Storm.js';

const TYPE_MAP = {
  rocky:   Rocky,
  gas:     Gas,
  ice:     Ice,
  lava:    Lava,
  ocean:   Ocean,
  desert:  Desert,
  nebular: Nebular,
  storm:   Storm,
};

export function createWorld(data, parentGroup) {
  const Cls = TYPE_MAP[data.type] ?? Rocky;
  return new Cls(data, parentGroup);
}
