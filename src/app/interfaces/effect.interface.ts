import { EffectSchoolEnum } from '@app/enums/effect-school.enum';
import { EffectTypeEnum } from '@app/enums/effect-type.enum';

export interface Effect {
  id?: string;
  name: string;
  school: EffectSchoolEnum;
  type: EffectTypeEnum;
}
