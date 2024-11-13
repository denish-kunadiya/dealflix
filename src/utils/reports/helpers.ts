import snakeCase from 'lodash/snakeCase';
export const calcInnerSegmentTitle = (innerSegmentPath: string) => {
  try {
    const separator = '...';
    const rawArray = innerSegmentPath.split('/');
    let titleSegments = [...rawArray];

    if (rawArray.length > 3) {
      titleSegments = [rawArray[0], separator, rawArray[rawArray.length - 1]];
    }

    const title = titleSegments
      .map((t) => (t === separator ? t : snakeCase(t)))
      .join(' > ')
      .replace(/_/g, ' ');

    return title;
  } catch (error) {
    return innerSegmentPath;
  }
};

export const calcTitleFromSelectValue = (value: string) => {
  try {
    return value.replace(/_/g, ' ');
  } catch (error) {
    return value;
  }
};

export const calcArrayItemTitle = (value: string) => {
  try {
    if (!value) return '';

    return `- ${calcTitleFromSelectValue(value)}`;
  } catch (error) {
    return value;
  }
};
