from apis import sdrs as sdrs_api


def handle_list_sdrs() -> list[dict]:
    return sdrs_api.list_sdrs()
