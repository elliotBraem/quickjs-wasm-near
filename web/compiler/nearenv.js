import { createQuickJS } from "./quickjs.js";

export function createNearEnv(args = '', attached_deposit, storage = {}, signer_account_id) {
    const registers = {};

    const storage_read = (key, register_id) => {
        if (storage[key] != undefined) {
            registers[register_id] = storage[key]
            return 1n;
        } else {
            return 0n;
        }
    };

    const storage_write = (key, value, register_id) => storage[key] = value;
    const storage_has_key = (key) => storage[key] != undefined;
    const storage_remove = (key) => delete storage[key];
    const input = (register) => registers[register] = args;

    return {
        // added after standalone contract support
        "current_account_id": (register) => registers[register] = 'test',
        "input": input,
        "storage_usage": () => null,
        "storage_write": storage_write,
        "storage_remove": storage_remove,
        "account_balance": () => null,
        "account_locked_balance": () => null,
        "value_return": (val) => print(`return value: ${val}`),
        "promise_batch_action_create_account": () => null,
        "promise_batch_action_deploy_contract": () => null,
        "promise_batch_action_function_call": () => null,
        "promise_batch_action_transfer": () => null,
        "promise_batch_action_stake": () => null,
        "promise_batch_action_add_key_with_full_access": () => null,
        "promise_batch_action_add_key_with_function_call": () => null,
        "promise_batch_action_delete_key": () => null,
        "promise_batch_action_delete_account": () => null,
        "promise_batch_action_function_call_weight": () => null,
        // enclave
        "read_register": (register) => registers[register],
        "register_len": () => BigInt(Object.keys(registers).length),
        "write_register": () => null,
        "signer_account_id": (register) => registers[register] = signer_account_id,
        "signer_account_pk": () => null,
        "predecessor_account_id": (register) => registers[register] = signer_account_id,
        "block_index": () => null,
        "block_timestamp": () => new Date().getTime(),
        "epoch_height": () => null,
        "attached_deposit": () => attached_deposit,
        "prepaid_gas": () => null,
        "used_gas": () => null,
        "random_seed": () => null,
        "sha256": () => null,
        "keccak256": () => null,
        "keccak512": () => null,
        "ripemd160": () => null,
        "ecrecover": () => null,
        "panic": () => null,
        "panic_utf8": () => null,
        "log": (msg) => print(msg),
        "log_utf8": (len, addr) => console.log(len, addr),
        "log_utf16": () => null,
        "promise_create": () => null,
        "promise_then": () => null,
        "promise_and": () => null,
        "promise_batch_create": () => null,
        "promise_batch_then": () => null,
        "promise_results_count": () => null,
        "promise_result": () => null,
        "promise_return": () => null,
        "storage_read": storage_read,
        "storage_has_key": storage_has_key,
        "validator_stake": () => null,
        "validator_total_stake": () => null,

        // APIs that unique to JSVM
        "jsvm_account_id": () => null,
        "jsvm_js_contract_name": () => null,
        "jsvm_method_name": () => null,
        "jsvm_args": input,
        "jsvm_storage_write": storage_write,
        "jsvm_storage_read": storage_read,
        "jsvm_storage_has_key": storage_has_key,
        "jsvm_storage_remove": storage_remove,
        "jsvm_value_return": (val) => print(`return value: ${val}`),
        "jsvm_call": () => null,
        "print_storage": () => print(JSON.stringify(storage)),

        // APIs unique to Rust NFT example
        "base64_encode": (val) => encode(val),
        "sha256_utf8_to_base64": () => null,
        "get_content_base64": () => null,
        "contract_owner": () => null,
        "nft_token": () => null,
        "nft_supply_for_owner": () => null,
        "nft_tokens": () => null
    }
};

export function getNearEnvSource() {
    return createNearEnv.toString();
}

export async function createQuickJSWithNearEnv(args, attached_deposit = '0', storage = {}, signer_account_id) {
    const argsBase64 = btoa(args);
    const quickjs = await createQuickJS();
    await quickjs.evalSource(await fetch('https://cdn.jsdelivr.net/npm/js-base64@3.7.2/base64.mjs').then(r => r.text()), 'js-base64');
    await quickjs.evalSource(`
    import { decode, encode } from 'js-base64';
    globalThis.env = (${getNearEnvSource()})(decode('${argsBase64}'),BigInt('${attached_deposit}'), ${JSON.stringify(storage)}, '${signer_account_id}');
`, 'env');
    
    return quickjs;
}
