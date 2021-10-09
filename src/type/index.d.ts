export {}
declare global {
    interface IResponse<T = any> {
			code: number;
			message: string;
			body: T;
			data: T;
    }
    interface IObject<T> {
      [index: string]: T
    }
    
    interface ITable<T = any> {
			data : Array<T>
			count: number
			current: number
			size: number
			recordCount: number
    }
    interface ImportMetaEnv {
		VITE_APP_TITLE: string
		VITE_PORT: number;
		VITE_PROXY: string;
    }
    interface IElementFormRule {
			required: boolean, 
			message: string,
			trigger: string,
			validator: () => any
    }
    interface IElementTree {
			id: string,
			label: string,
			children: IElementTree[]
		}
      
    interface IElementSelectOption {
			label: string, 
			value: number
		}

		interface IImageItem {
			id: number,
			name: string,
			url: string
		}
}