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
	updateFn(); // Выполняем функцию и записываем зависимости
	activeWatcher = null;
}

// Создаём реактивное свойство
const dep = new Dep();
const state = {
	_count: 0,
	get count() {
		dep.depend(); // Запоминаем, кто использует `count`
		return this._count;
	},
	set count(value) {
		this._count = value;
		dep.notify(); // Оповещаем подписчиков
	}
};

// Используем реактивную переменную
autorun(() => {
	console.log("🔄 Ререндер:", state.count);
});

state.count = 5; // 🔄 Ререндер: 5
state.count = 10; // 🔄 Ререндер: 10
	