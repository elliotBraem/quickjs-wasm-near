import { evalSource, compileToByteCode, evalByteCode } from './compilerutils.js';

describe('compiler', () => {
    it('should compile and evaluate js', async () =>  {
        console.log('eval js', await evalSource(`(function () {return 11+34+55+"test".length})()`));
        console.log('eval bytecode', await evalByteCode([0x02, 0x02, 0x08, 0x74, 0x65, 0x73, 0x74, 0x1a,
            0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x5f, 0x6e, 0x65,
            0x61, 0x72, 0x2e, 0x6a, 0x73, 0x0e, 0x00, 0x06,
            0x00, 0xa0, 0x01, 0x00, 0x01, 0x00, 0x02, 0x00,
            0x00, 0x0a, 0x01, 0xa2, 0x01, 0x00, 0x00, 0x00,
            0x04, 0xde, 0x00, 0x00, 0x00, 0xe9, 0xb9, 0x9d,
            0xcd, 0x28, 0xbe, 0x03, 0x01, 0x00]));

        let bytecode = await compileToByteCode(`(function () {return 11+34+55+"test".length})()`);
        console.log('eval compiled bytecode', await evalByteCode(bytecode));

        console.log('JSON parse', await evalSource(`JSON.parse('1')`));
        console.log('JSON parse in bytecode', await evalByteCode([0x02, 0x02, 0x0a, 0x70, 0x61, 0x72, 0x73, 0x65,
            0x1a, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x5f, 0x6e,
            0x65, 0x61, 0x72, 0x2e, 0x6a, 0x73, 0x0e, 0x00,
            0x06, 0x00, 0xa0, 0x01, 0x00, 0x01, 0x00, 0x03,
            0x00, 0x01, 0x11, 0x01, 0xa2, 0x01, 0x00, 0x00,
            0x00, 0x38, 0x9b, 0x00, 0x00, 0x00, 0x42, 0xde,
            0x00, 0x00, 0x00, 0xbf, 0x00, 0x24, 0x01, 0x00,
            0xcd, 0x28, 0xbe, 0x03, 0x01, 0x00, 0x07, 0x02,
            0x31]));

        console.log('JSON parse compile and eval', await evalByteCode(await compileToByteCode(`JSON.parse('{"a": 222}').a+3`)));
    });
});