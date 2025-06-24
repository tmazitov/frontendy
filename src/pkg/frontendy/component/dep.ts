class Dep {
	subscribers = new Set<Function>();

	depend() {
		if (activeWatcher) {
			this.subscribers.add(activeWatcher);
		}
	}

	notify() {
		this.subscribers.forEach(sub => sub());
	}
}

let activeWatcher: Function | null = null;

function autorun(updateFn: Function) {
	activeWatcher = updateFn;
	updateFn(); 
	activeWatcher = null;
}


const dep = new Dep();
const state = {
	_count: 0,
	get count() {
		dep.depend(); 
		return this._count;
	},
	set count(value) {
		this._count = value;
		dep.notify(); 
	}
};

autorun(() => {
	console.log("🔄 Rerender:", state.count);
});

state.count = 5; 
state.count = 10; 
	