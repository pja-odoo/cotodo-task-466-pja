export function transformObject<T extends Record<string, any>, U>(
	obj: T,
	callback: (entity: T[keyof T], key: keyof T) => U
): { readonly [K in keyof T]: U } {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => {
			return [key, callback(value as T[keyof T], key as keyof T)];
		})
	) as { readonly [K in keyof T]: U };
}
